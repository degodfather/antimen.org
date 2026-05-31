import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { Hero, ImageAndText, CtaCards, TextCards, FeatureShowcase, CtaImageButton, icons } from '@infinum/docusaurus-theme';
import { EsOpenSource } from '../theme/sections/os-projects';
import { EsOsFreebies } from '../theme/sections/os-freebies';

export default function Home() {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;

	return (
		<Layout
			title={siteConfig.title}
			description={siteConfig.tagline}
			keywords={siteConfig.customFields.keywords}
			metaImage={useBaseUrl(`img/${siteConfig.customFields.image}`)}
			wrapperClassName='es-footer-white'
		>
			<Hero
				title='Justice for Men. Fairness for All.'
				subtitle='
A community-driven, open-source platform documenting laws, policies, court decisions, and incidents that impact men and boys in India. Our mission is to provide facts, evidence, and educational resources that promote equal treatment under the law and informed debate on gender issues. Because equality should apply to everyone.'
				buttonLabel='Get started'
				buttonUrl='/incidents'
				imageUrl='/img/homepage/man-logo.png'
				gray
			/>

			

			<TextCards
				title='Why do we think there is a problem?'
				cards={[
					{
						title: 'Suicides',
						subtitle: "79% of India's suicides are men.",
					},
					{
						title: 'Laws',
						subtitle: 'More than 20 major women-centric laws. 0 for men.'
					},
					{
						title: 'Child Custody',
						subtitle: 'Men face significant challenges in child custody cases, mother is always considered the primary caregiver.'
					},
					{
						title: 'Arrest without evidence',
						subtitle: "Men always consider guilty until proven innocent. Wrongful arrests are common, with devastating consequences for the accused and their families."
					},
					
				]}
			/>

		
			<EsOsFreebies />
		</Layout>
	);
}
