import React from 'react';
import { CtaImageButton } from '@infinum/docusaurus-theme';

export const EsOsFreebies = (props) => {
	return (
		<CtaImageButton
			{...props}
			title='Learn about laws, policies, incidents, and social challenges affecting men and boys.'
			buttonLabel='Contribute to the cause'
			buttonUrl='https://github.com/degodfather/antimen.org'
			imageUrl='/img/homepage/infinum-open-source.svg'
		/>
	);
};
