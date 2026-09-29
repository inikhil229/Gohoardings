import { executeQuery } from "@/server/conn/conn";

export default async function handler(req, res) {
  try {
    // Allow only GET requests
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
    }
  
    const cookies = req.cookies;
    const countryCode = cookies.selected_country || "IN"; // Default to India if not set
    

    // Fetch FAQs from the database
    const query = `
      SELECT id, qsn, ans, ans2, ans3, ans4, created_at, updated_at
      FROM wordcounts
      ORDER BY id ASC
    `;

    const data = await executeQuery(query,[],countryCode);

    // Handle empty data
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No FAQs found",
      });
    }

    // Success response with data
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching FAQs data:", error);

    // Return a generic error response
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
