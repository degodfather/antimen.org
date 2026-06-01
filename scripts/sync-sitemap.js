const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const buildSitemapPath = path.join(rootDir, 'build', 'sitemap.xml');
const staticDir = path.join(rootDir, 'static');
const staticSitemapPath = path.join(staticDir, 'sitemap.xml');

if (!fs.existsSync(buildSitemapPath)) {
	console.error('sitemap.xml was not generated in build/.');
	process.exit(1);
}

if (!fs.existsSync(staticDir)) {
	fs.mkdirSync(staticDir, { recursive: true });
}

fs.copyFileSync(buildSitemapPath, staticSitemapPath);
console.log('Sitemap synced:', staticSitemapPath);
