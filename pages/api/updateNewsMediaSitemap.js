import { writeFileSync } from 'fs';
import { executeQuery } from '@/server/conn/conn';

export default async function updateBlogSitemap(req, res) {
    try {
        const qry = "SELECT url,update_on FROM gohoardings_news WHERE news_for = 'gohoarding' AND status=1 ORDER BY id DESC";
        const data = await executeQuery(qry, "gohoardi_crmapp");

        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        const changefreq = "daily";
        const priority = "0.8";

        data.forEach(news => {
          const isoDate = new Date(news.update_on).toISOString();
            xmlContent += `<url>\n`;
            xmlContent += `<loc>${news.url}</loc>\n`;
            xmlContent += `<lastmod>${isoDate}</lastmod>\n`;
            xmlContent += `<changefreq>${changefreq}</changefreq>\n`;
            xmlContent += `<priority>${priority}</priority>\n`;
            xmlContent += `</url>\n`;
        });

        xmlContent += '</urlset>';

        // Write the XML content to a file
        writeFileSync('public/media-and-news-sitemap.xml', xmlContent);

        res.status(200).send('Sitemap updated successfully');
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Internal Server Error');
    }
}
