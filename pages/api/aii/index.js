// pages/api/chat.js
import { executeQuery } from "../../../server/conn/conn";  // your conn.js
const { generateSQL } = require("/lib/pplx");

const tableFields = [
  "id", "main_media_id", "client_id", "media_owner_code", "digital_slot_length", 
  "digitial_slot_playing_limit", "client_code", "category_id", "category_name", 
  "subcategory_id", "subcategory", "building_name", "flight_name", "mall_name", 
  "medianame", "code", "card_rate", "saleasbunch", "totalno", "price_2", 
  "price", "price_format", "pricetype", "thumbnail", "thumb", "location", 
  "size", "state", "city", "city_name", "district", "width", "widthunit", 
  "height", "heightunit", "foot_fall", "illumination", "ftf", "latitude", 
  "longitude", "status", "page_title", "isBooked", "footfall", "created", 
  "created_by", "modified", "modified_by", "geolocation", "mediaownercompanyname", 
  "mediacompanyname", "mediaownername", "email", "phonenumber", "companyaddress", 
  "areadescription", "area"
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { userMessage, countryCode = "IN" } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Missing user message" });
    }

    // Step 1: Generate SQL query from user input
    const sqlQuery = await generateSQL(userMessage, tableFields);

    // Basic safety (block DROP/DELETE/UPDATE to prevent damage)
    if (/drop|delete|update|insert/i.test(sqlQuery)) {
      return res.status(400).json({ error: "Dangerous SQL query detected" });
    }

    // Step 2: Execute query
    const results = await executeQuery(sqlQuery, [], countryCode);

    res.status(200).json({
      success: true,
      sql: sqlQuery,
      results
    });

  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
