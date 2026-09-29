import { executeQuery } from "/server/conn/conn";
import { generatePDF } from "/lib/pdfGenerator";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { filters, countryCode = "IN" } = req.body;

    const tables = [
      "goh_media",
      "goh_media_digital",
      "goh_media_mall",
      "goh_media_flight",
    ];

    const queries = tables.map((table) => {
      let q = `SELECT '${table}' as source, medianame, city, city_name, price, foot_fall, isBooked, thumbnail, thumb, category_name 
               FROM ${table} WHERE status='active'`;
      const params = [];

      if (filters.city) {
        q += " AND (city = ? OR city_name = ?)";
        params.push(filters.city, filters.city);
      }

      if (filters.budget) {
        q += " AND price <= ?";
        params.push(filters.budget);
      }

      if (filters.category) {
        q += " AND category_name LIKE ?";
        params.push(`%${filters.category}%`);
      }

      return { q, params };
    });

    const unionQuery = queries.map((x) => x.q).join(" UNION ALL ");
    const fullQuery = `${unionQuery} ORDER BY price ASC LIMIT 50`;
    const allParams = queries.flatMap((x) => x.params);

    const results = await executeQuery(fullQuery, allParams, countryCode);

    const pdfBuffer = await generatePDF(results, filters);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=media-plan.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF API error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
