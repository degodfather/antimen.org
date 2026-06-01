const path = require('path');
const fs = require('fs');

function walkDir(dir) {
	const results = [];

	if (!fs.existsSync(dir)) {
		return results;
	}

	for (const file of fs.readdirSync(dir)) {
		if (file.startsWith('.') || file.startsWith('_')) {
			continue;
		}

		const fullPath = path.join(dir, file);

		if (fs.statSync(fullPath).isDirectory()) {
			results.push(...walkDir(fullPath));
		} else if (/\.(md|mdx)$/.test(file)) {
			results.push(fullPath);
		}
	}

	return results;
}

function parseFrontMatter(content) {
	const match = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);

	if (!match) {
		return {};
	}

	const yaml = match[1];
	const result = {};

	const titleMatch = yaml.match(/^title:\s*["']?(.*?)["']?\s*$/m);
	const dateMatch = yaml.match(/^date:\s*(\S+)/m);
	const slugMatch = yaml.match(/^slug:\s*["']?(.*?)["']?\s*$/m);

	if (titleMatch) {
		result.title = titleMatch[1].trim();
	}

	if (dateMatch) {
		result.date = dateMatch[1].trim();
	}

	if (slugMatch) {
		result.slug = slugMatch[1].trim();
	}

	return result;
}

module.exports = function incidentsDataPlugin(context) {
	return {
		name: 'incidents-data-plugin',

		async loadContent() {
			const incidentsDir = path.join(context.siteDir, 'incidents');
			const files = walkDir(incidentsDir);
			const incidents = [];

			for (const filePath of files) {
				const fileName = path.basename(filePath, path.extname(filePath));

				// Skip index/landing files
				if (fileName === 'index') {
					continue;
				}

				const content = fs.readFileSync(filePath, 'utf-8');
				const fm = parseFrontMatter(content);

				if (!fm.title) {
					continue;
				}

				// Build permalink from file path relative to incidents dir
				const relPath = path.relative(incidentsDir, filePath);
				const dirParts = path
					.dirname(relPath)
					.split(path.sep)
					.filter((p) => p !== '.');
				const baseName = path.basename(filePath).replace(/\.(md|mdx)$/, '');

				let permalink;

				if (fm.slug && fm.slug.startsWith('/')) {
					// Absolute slug overrides everything
					permalink = '/incidents' + fm.slug;
				} else if (fm.slug) {
					const prefix = dirParts.length > 0 ? dirParts.join('/') + '/' : '';
					permalink = '/incidents/' + prefix + fm.slug;
				} else {
					const prefix = dirParts.length > 0 ? dirParts.join('/') + '/' : '';
					permalink = '/incidents/' + prefix + baseName;
				}

				incidents.push({
					title: fm.title,
					date: fm.date || null,
					permalink,
				});
			}

			// Sort by date descending, undated articles last
			incidents.sort((a, b) => {
				if (!a.date && !b.date) {
					return 0;
				}

				if (!a.date) {
					return 1;
				}

				if (!b.date) {
					return -1;
				}

				return new Date(b.date) - new Date(a.date);
			});

			return incidents;
		},

		async contentLoaded({ content, actions }) {
			actions.setGlobalData({ incidents: content });
		},
	};
};
