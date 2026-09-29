import { executeQuery } from "@/server/conn/conn";

export default async function handler(req, res) {
  try {
    // Only process GET requests
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
    }

    // Extract countryCode from cookieData
    const countryCode = req.cookies?.selected_country || "IN"; // Default to "IN" if missing

    // SQL query to fetch city data
    const query = `
      SELECT city, href, no, src, alt
      FROM cities
      ORDER BY id ASC
    `;

    // Execute the query using the countryCode
    const data = await executeQuery(query, [], countryCode, req);

    // Handle case where no data is found
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cities found",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching city data:", error);

    // Internal server error response
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
