import React, { useState } from 'react';
import useGlobalData from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';

const PAGE_SIZE = 20;

function formatDate(dateStr) {
	if (!dateStr) {
		return '';
	}

	const d = new Date(dateStr);

	if (isNaN(d)) {
		return dateStr;
	}

	return d.toLocaleDateString('en-IN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export default function IncidentsList() {
	const [page, setPage] = useState(1);
	const globalData = useGlobalData();
	const incidents = globalData?.['incidents-data-plugin']?.default?.incidents ?? [];

	const totalPages = Math.max(1, Math.ceil(incidents.length / PAGE_SIZE));
	const start = (page - 1) * PAGE_SIZE;
	const pageItems = incidents.slice(start, start + PAGE_SIZE);

	if (incidents.length === 0) {
		return <p>No incidents found.</p>;
	}

	return (
		<div className='incidents-list'>
			<div className='incidents-list__items'>
				{pageItems.map((incident, i) => (
					<div key={start + i} className='incidents-list__item'>
						<Link to={incident.permalink} className='incidents-list__title'>
							{incident.title}
						</Link>
						{incident.date && (
							<span className='incidents-list__date'>{formatDate(incident.date)}</span>
						)}
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<div className='incidents-list__pagination'>
					<button
						className='incidents-list__page-btn'
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
					>
						← Previous
					</button>
					<span className='incidents-list__page-info'>
						Page {page} of {totalPages}
					</span>
					<button
						className='incidents-list__page-btn'
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page === totalPages}
					>
						Next →
					</button>
				</div>
			)}
		</div>
	);
}
