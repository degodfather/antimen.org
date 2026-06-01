const { themes } = require('prism-react-renderer');

const darkTheme = themes.dracula;

module.exports = {
	title: 'antimen.org | Men\'s Civil Rights and Advocacy',
	tagline:
		'All the tools you need to start building a modern WordPress project, using all the latest front end development tools.',
	url: 'https://antimen.org',
	baseUrl: '/',
	favicon: '/img/favicon.png',
	organizationName: 'antimen',
	projectName: 'antimen_web',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	staticDirectories: ['static'],
	scripts: [
		{
			src: 'https://buttons.github.io/buttons.js',
			async: true,
			defer: true,
		},
	],
	themeConfig: {
		navbar: {
			logo: {
				alt: 'Antimen.org Logo',
				src: '/img/antimen_logo_transparent.png',
			},
			items: [
				{
					to: 'incidents/',
					activeBasePath: 'incidents',
					label: 'Incidents',
					position: 'right',
				},
				
				{
					to: '/laws/',
					activeBasePath: 'laws',
					label: 'Laws',
					position: 'right',
				},
				{
					to: '/myths/',
					activeBasePath: 'myths',
					label: 'Myths',
					position: 'right',
				},
				{
					to: '/socialmedia/',
					activeBasePath: 'socialmedia',
					label: 'Social Media',
					position: 'right',
				},
				{
					to: 'https://github.com/degodfather/antimen.org/discussions',
					activeBasePath: 'reportincident',
					label: 'Report an Incident',
					position: 'right',
				},
				{
					to: 'https://www.saveindianfamily.org/india/donate/',
					activeBasePath: 'donate',
					label: 'Donate',
					position: 'right',
				},
				{
					to: 'https://github.com/degodfather/antimen.org',
					activeBasePath: 'opensource',
					label: 'Open Source',
					position: 'right',
				},
			],
		},
		footer: {
			links: [
				{
					title: 'Community',
					items: [
						{
							label: 'GitHub',
							href: 'https://github.com/degodfather/antimen.org',
							icon: 'github',
						},
						
					],
				},
			],
			copyright: 'Made with ❤️ by <a href="https://github.com/degodfather/antimen.org/graphs/contributors">Antimen.org team.</a> Contributed by volunteers from around the world.',
		},
		algolia: {
			appId: 'IEU8MLHJX0',
			apiKey: '512bc4ce71ecac259c2a0b6d1d80df1b',
			indexName: 'antimen_org_ieu8mlhjx0_articles',
			startUrls: [
				'https://antimen.org'
			],
			contextualSearch: false,
		},
		prism: {
			theme: darkTheme,
			additionalLanguages: ['php', 'scss', 'css', 'diff'],
		},
		colorMode: {
			defaultMode: 'light',
			disableSwitch: true,
			respectPrefersColorScheme: false,
		},
		docs: {
			sidebar: {
				autoCollapseCategories: true,
			},
		},
		trailingSlash: false,
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					path: 'incidents',
					routeBasePath: 'incidents',
					sidebarPath: require.resolve('./sidebars.js'),
					sidebarCollapsible: true,
					sidebarItemsGenerator: async ({defaultSidebarItemsGenerator, ...args}) => {
						const items = await defaultSidebarItemsGenerator(args);
						const docsById = new Map(args.docs.map((doc) => [doc.id, doc]));

						const isYearCategory = (item) => {
							if (item.type !== 'category' || typeof item.label !== 'string') {
								return false;
							}

							return /^\d{4}$/.test(item.label);
						};

						const getDocDateTimestamp = (item) => {
							if (item.type !== 'doc') {
								return null;
							}

							const dateValue = docsById.get(item.id)?.frontMatter?.date;
							if (!dateValue) {
								return null;
							}

							const parsedTimestamp = Date.parse(String(dateValue));
							return Number.isNaN(parsedTimestamp) ? null : parsedTimestamp;
						};

						const getItemSortKey = (item) => {
							if (item.type === 'doc') {
								return item.id ?? item.label ?? '';
							}

							if (item.type === 'category') {
								return item.label ?? '';
							}

							return item.label ?? item.href ?? '';
						};

						const sortCategoryItemsDescending = (item) => {
							if (item.type !== 'category' || !Array.isArray(item.items)) {
								return item;
							}

							const sortedItems = item.items
								.map(sortCategoryItemsDescending)
								.sort((a, b) => {
									const aDate = getDocDateTimestamp(a);
									const bDate = getDocDateTimestamp(b);

									if (aDate !== null || bDate !== null) {
										if (aDate === null) {
											return 1;
										}

										if (bDate === null) {
											return -1;
										}

										if (aDate !== bDate) {
											return bDate - aDate;
										}
									}

									return getItemSortKey(b).localeCompare(getItemSortKey(a), undefined, {
										numeric: true,
										sensitivity: 'base',
									});
								});

							return {
								...item,
								items: sortedItems,
							};
						};

						const yearItems = items
							.filter(isYearCategory)
							.map(sortCategoryItemsDescending)
							.sort((a, b) => Number(b.label) - Number(a.label));

						const nonYearItems = items.filter((item) => !isYearCategory(item));

						return [...yearItems, ...nonYearItems];
					},
				},
				gtag: {
					trackingID: 'GTM-P5GG5DH',
					anonymizeIP: true,
				},
				theme: {
					customCss: [
						require.resolve('@infinum/docusaurus-theme/dist/style.css'),
						require.resolve('./src/theme/styles.css'),
					],
				},
				blog: {
					blogTitle: 'Tutorials and articles about Eightshift development kit',
					blogDescription:
						'Tutorials and articles about Eightshift development kit',
					blogSidebarTitle: 'Latest posts',
					showReadingTime: true,
					postsPerPage: 9,
				},
				sitemap: {
					filename: 'sitemap.xml',
					lastmod: 'date',
					changefreq: 'weekly',
					priority: 0.5,
				},
			},
		],
	],
	plugins: [
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'forms',
				path: 'forms',
				routeBasePath: 'forms',
				sidebarPath: require.resolve('./sidebars-forms.js'),
			},
		],
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'laws',
				path: 'laws',
				routeBasePath: 'laws',
				sidebarPath: require.resolve('./sidebars-laws.js'),
			},
		],
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'myths',
				path: 'myths',
				routeBasePath: 'myths',
				sidebarPath: require.resolve('./sidebars-myths.js'),
			},
		],
		'es-text-loader',
	],
	customFields: {
		keywords: [
			'wordpress tools',
			'development tools',
			'wordpress project',
			'Gutenberg blocks',
			'development kit',
			'wordpress kit',
			'devkit',
		],
		image: 'img-why-boilerplate@2x.png',
	},
};
