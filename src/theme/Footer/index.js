import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';

import { Footer as InfinumFooter } from '@infinum/docusaurus-theme';

function Footer() {
	const { footer } = useThemeConfig();
	const footerWithRichCopyright = {
		...footer,
		copyright: (
			<>
				Made with ❤️ by{' '}
				<a href='https://github.com/degodfather/antimen.org/graphs/contributors'>
					Antimen.org team.</a>{' '} Contributed by volunteers from around the world.
			</>
		),
	};

	return (
		<InfinumFooter footer={footerWithRichCopyright} />
	);
}

export default React.memo(Footer);
