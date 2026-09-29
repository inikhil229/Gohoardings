const { extractFilters } = require("/lib/intentExtractor");
const { fetchMedia } = require("/lib/queryBuilder");
const { generatePDF } = require("/lib/pdfGenerator");

async function queryMediaHandler(req, res, next) {
  try {
    const { query, countryCode } = req.body; // user text + optional country
    const filters = await extractFilters(query);

    const rows = await fetchMedia(filters, countryCode || "IN");

    if (filters.make_pdf) {
      const pdfBuffer = await generatePDF(rows, filters);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=plan.pdf");
      return res.send(pdfBuffer);
    }

    res.json({ success: true, filters, data: rows });
  } catch (error) {
    console.error(error);
    next(error); // will use your ErrorHandle middleware
  }
}

module.exports = { queryMediaHandler };
