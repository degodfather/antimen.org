import React from 'react';
import {Redirect} from '@docusaurus/router';
import usePluginData from '@docusaurus/useGlobalData';

export default function IncidentsLatestRedirect() {
	const incidentsDocsData = usePluginData('docusaurus-plugin-content-docs', 'default');
	const currentVersion = incidentsDocsData?.versions?.find((version) => version.name === 'current') ?? incidentsDocsData?.versions?.[0];
	const latestIncidentPath = currentVersion?.sidebars?.docs?.link?.path;
	const incidentsHomePath = currentVersion?.path ?? '/incidents';

	if (!latestIncidentPath || latestIncidentPath === incidentsHomePath) {
		return (
			<div>
				No incidents are available yet.
			</div>
		);
	}

	return <Redirect to={latestIncidentPath} />;
}
