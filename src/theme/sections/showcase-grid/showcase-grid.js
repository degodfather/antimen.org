import React, { Fragment, useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ShowcaseCard, CtaImageButton } from '@infinum/docusaurus-theme';
import { EsOpenSource } from '../os-projects';

const shuffleArray = (array) => array.map(value => ({ value, sort: Math.random() }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value);

export default function ShowcaseGrid(props) {
	const {
		privateType,
	} = props;

	const headingTitle = privateType ? 'Influencers' : 'Influencers';
	const headingSubtitle = privateType ? "Follow those who speak the truth." : 'Follow those who speak the truth.';
	const ctaTitle = privateType ? "Let's get in touch" : (<span>Want to add your <br /> project to the list?</span>);
	const ctaSubtitle = privateType ? 'Contact us' : 'Open an issue on GitHub';
	const ctaUrl = privateType ? 'https://antimen.org/' : 'https://github.com/infinum/eightshift-docs/issues';

	const privateData = [
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1878097626895130625/Uwmxta2k_400x400.jpg'),
			label: 'Save Indian Family Foundation',
			desc: 'HAK news portal.',
			link: 'https://x.com/realsiff',
		},
		{
			image: useBaseUrl('img/showcase/crveninosovi.webp'),
			label: 'Crveni nosovi',
			desc: 'Our mission is to restore the feeling of joy, happiness and optimism in difficult life circumstances.',
			link: 'https://www.crveninosovi.hr/',
		},
	];

	const publicData = [
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1878097626895130625/Uwmxta2k_400x400.jpg'),
			label: 'Save Indian Family Foundation',
			desc: 'X account of Save Indian Family Foundation.',
			link: 'https://x.com/realsiff',
		},
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1595612326773735424/PoYzZVwm_400x400.jpg'),
			label: 'Venom',
			desc: 'X account of Venom',
			link: 'https://x.com/venom1s',
		},
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1840433479042973696/_2bBpuPh_400x400.jpg'),
			label: 'Professor Siff',
			desc: 'X account of Professor Siff.',
			link: 'https://x.com/Rads0071',
		},
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1878651581845159936/rg0yC4a8_400x400.jpg'),
			label: 'The Forgotten ‘Man’ 👨‍⚖️',
			desc: '',
			link: 'https://x.com/SamSiff',
		},
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1878097626895130625/Uwmxta2k_400x400.jpg'),
			label: 'Save Indian Family Foundation Pune',
			desc: 'Instagram account of Save Indian Family Foundation Pune.',
			link: 'https://www.instagram.com/siff_pune/',
		},
		{
			image: useBaseUrl('https://pbs.twimg.com/profile_images/1870219159017263104/RR7C9wsI_400x400.jpg'),
			label: 'IsserHarel (Trump ka Parivaar)',
			desc: 'X account of IsserHarel (Trump ka Parivaar).',
			link: 'https://x.com/IsserHarrel',
		},
		
	];

	const itemsData = privateType ? [...publicData, ...privateData] : publicData;

	// https://reactjs.org/docs/react-dom.html#hydrate
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true)
	}, []);

	const items = shuffleArray(itemsData).map((item, index) => {
		const {
			image,
			label,
			link,
			desc,
		} = item;

		return (
			<ShowcaseCard
				key={index}
				url={link}
				imageUrl={image}
				imageAlt={label}
				title={label}
				description={desc}
			/>
		)
	});

	return (
		// key={isClient ? 1 : 2} will trigger a rerender of the whole subtree and the images will be aligned with text
		<Fragment key={isClient ? 1 : 2}>
			<h1 className='es-big-title es-h-center'>{headingTitle}</h1>
			<p className='es-big-subtitle es-text-center es-h-center'>{headingSubtitle}</p>

			<div className='es-showcase-grid'>
				{items}
			</div>

			

		</Fragment>
	);
}
