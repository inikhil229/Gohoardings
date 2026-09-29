const PDFDocument = require("pdfkit");
const axios = require("axios"); // to fetch remote thumbnails
const fs = require("fs");

async function generatePDF(rows, filters) {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ---------- Header ----------
    doc.fontSize(18).text("GoHoardings Media Plan", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Filters: ${JSON.stringify(filters)}`);
    doc.moveDown();

    // ---------- Media Cards ----------
    for (let index = 0; index < rows.length; index++) {
      const item = rows[index];

      // Title
      doc.fontSize(14).fillColor("black").text(
        `${index + 1}. ${item.medianame} (${item.category})`,
        { underline: true }
      );

      // Location + Price
      doc.fontSize(11).fillColor("black").text(
        `${item.city}, ${item.area || ""} | Price: ₹${item.price} | Footfall: ${item.foot_fall}`
      );
      doc.text(`Status: ${item.isBooked ? "Booked" : "Available"}`);

      // Thumbnail if exists
      if (item.thumbnail || item.thumb) {
        try {
          const imageUrl = item.thumbnail || item.thumb;
          const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
          const imgBuffer = Buffer.from(response.data, "binary");

          // Add image with fixed size
          const imgX = doc.x;
          const imgY = doc.y + 5;
          doc.image(imgBuffer, imgX, imgY, { width: 180, height: 120 });
          doc.moveDown(7);
        } catch (err) {
          console.warn(`Could not load image for ${item.medianame}:`, err.message);
          doc.fontSize(10).fillColor("red").text("Image not available");
          doc.moveDown();
        }
      }

      doc.moveDown();
      doc.moveDown();
    }

    doc.end();
  });
}

module.exports = { generatePDF };
