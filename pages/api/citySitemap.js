import { writeFileSync } from "fs";
import { executeQuery } from "@/server/conn/conn";

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default async function updatehoardingSitemap(req, res) {
  const cities = [
    { city: "delhi" },
    { city: "noida" },
    { city: "pune" },
    { city: "bengaluru" },
    { city: "chennai" },
    { city: "hyderabad" },
    { city: "mumbai" },
  ];

  try {
    for (const cityObj of cities) {
      const city = cityObj.city;
      const qry = "category_name,page_title,code";
      const data = await executeQuery(
        "SELECT " +
          qry +
          " FROM goh_media WHERE city_name = '" +
          city +
          "' UNION SELECT " +
          qry +
          " FROM goh_media_digital WHERE city_name = '" +
          city +
          "' UNION SELECT " +
          qry +
          " FROM goh_media_transit WHERE city_name = '" +
          city +
          "' UNION SELECT " +
          qry +
          " FROM goh_media_mall WHERE city_name = '" +
          city +
          "' UNION SELECT " +
          qry +
          " FROM goh_media_airport WHERE city_name = '" +
          city +
          "'",
        "gohoardi_goh"
      );

      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlContent +=
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      const changefreq = "daily";
      const priority = "0.8";

      data.forEach((hoarding) => {
        const isoDate = new Date().toISOString();
        xmlContent += `<url>\n`;
        xmlContent += `<loc>https://www.gohoardings.com/seedetails/${escapeXml(hoarding.category_name)}/${escapeXml(hoarding.page_title)}/${escapeXml(hoarding.code)}</loc>\n`;
        xmlContent += `<lastmod>${isoDate}</lastmod>\n`;
        xmlContent += `<changefreq>${changefreq}</changefreq>\n`;
        xmlContent += `<priority>${priority}</priority>\n`;
        xmlContent += `</url>\n`;
      });

      xmlContent += "</urlset>";

      // Write the XML content to a file
      writeFileSync(`public/${city}-sitemap.xml`, xmlContent);
    }

    res.status(200).send("Sitemaps updated successfully");
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
}
