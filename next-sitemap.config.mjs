/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://menetrendek.info',
    generateRobotsTxt: true,
    exclude: ['/settings', '/routes', '/runs', 'render'],
}

export default config