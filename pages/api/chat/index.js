import { executeQuery } from "/server/conn/conn";

// 🔹 Debug flag
const DEBUG = process.env.NODE_ENV !== "production";

// --- Extract filters using AI ---
async function extractFilters(userMessage, countryCode = "IN") {
  const prompt = `
You are a strict JSON generator. Parse the user request for OOH (Out-of-Home) advertising media filters.

Output ONLY a JSON object:
{
  "city": string | null,
  "budget_min": number | null,
  "budget_max": number | null,
  "category": string | null,
  "limit": number | null
}

Rules:
- "under 5000" → budget_max = 5000
- "below 20k" → budget_max = 20000
- "over 20000"/"above 5k" → budget_min = 20000 / 5000
- "give me 10" → limit = 10
- Categories:
  - "billboard"/"hoarding" → goh_media
  - "digital billboard" → goh_media_digital
  - "mall media" → goh_media_mall
  - "inflight"/"flight branding"/"airline" → goh_media_inflight
`;

  try {
    const resp = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "pplx-70b-chat",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0,
      }),
    });

    const data = await resp.json();
    let filters = JSON.parse(data?.choices?.[0]?.message?.content || "{}");

    // Fallback: try matching city from DB if missing
    if (!filters.city) {
      const citiesQuery = `
        SELECT DISTINCT city_name FROM (
          SELECT city_name FROM goh_media
          UNION SELECT city_name FROM goh_media_digital
          UNION SELECT city_name FROM goh_media_mall
          UNION SELECT city_name FROM goh_media_inflight
        ) AS all_cities
      `;
      const cityRows = await executeQuery(citiesQuery, [], countryCode);
      const allCities = cityRows.map((r) => r.city_name.toLowerCase());
      const matched = allCities.find((c) => userMessage.toLowerCase().includes(c));
      if (matched) filters.city = matched;
    }

    return filters;
  } catch (err) {
    console.error("Filter extraction error:", err);
    return {};
  }
}

// --- Fallback Regex parser ---
function fallbackParse(message) {
  const filters = {
    city: null,
    budget_min: null,
    budget_max: null,
    category: null,
    limit: null,
  };

  const underMatch = message.match(/under\s?(\d+)/i);
  const belowMatch = message.match(/below\s?(\d+)/i);
  const overMatch = message.match(/over\s?(\d+)/i);
  const aboveMatch = message.match(/above\s?(\d+)/i);
  const limitMatch = message.match(/give me (\d+)/i);

  if (underMatch) filters.budget_max = parseInt(underMatch[1]);
  if (belowMatch) filters.budget_max = parseInt(belowMatch[1]);
  if (overMatch) filters.budget_min = parseInt(overMatch[1]);
  if (aboveMatch) filters.budget_min = parseInt(aboveMatch[1]);
  if (limitMatch) filters.limit = parseInt(limitMatch[1]);

  if (/mall/i.test(message)) filters.category = "mall media";
  else if (/digital/i.test(message)) filters.category = "digital billboard";
  else if (/flight|inflight|airline/i.test(message)) filters.category = "inflight";
  else if (/billboard|hoarding/i.test(message)) filters.category = "billboard";

  const cityMatch = message.match(/in\s+([A-Z][a-z]+)/);
  if (cityMatch) filters.city = cityMatch[1];

  return filters;
}

// --- Map category to table ---
function getTablesByCategory(category) {
  if (!category) return ["goh_media", "goh_media_digital", "goh_media_mall", "goh_media_inflight"];

  const c = category.toLowerCase();
  if (c.includes("mall")) return ["goh_media_mall"];
  if (c.includes("digital")) return ["goh_media_digital"];
  if (c.includes("flight") || c.includes("inflight") || c.includes("airline")) return ["goh_media_inflight"];
  if (c.includes("billboard") || c.includes("hoarding")) return ["goh_media"];
  return [];
}

// --- Build SQL query ---
function buildQuery(filters) {
  const tables = getTablesByCategory(filters.category);
  if (!tables.length) return { fullQuery: null, allParams: [] };

  const queries = tables.map((table) => {
    let q = `
      SELECT '${table}' AS source, id, medianame, city, city_name, price,
             COALESCE(thumbnail, thumb) AS thumbnail, category_name
      FROM ${table}
      WHERE status='active'
    `;
    const params = [];

    // --- City filter (support multiple)
    if (filters.city) {
      const cities = Array.isArray(filters.city) ? filters.city : [filters.city];
      const cityConditions = cities.map(() => "(LOWER(city) = ? OR LOWER(city_name) = ?)").join(" OR ");
      q += " AND (" + cityConditions + ")";
      cities.forEach((c) => {
        const cLower = c.toLowerCase();
        params.push(cLower, cLower);
      });
    }

    // --- Budget filters (support multiple ranges)
    if (filters.budget_min) {
      const mins = Array.isArray(filters.budget_min) ? filters.budget_min : [filters.budget_min];
      q += " AND (" + mins.map(() => "price >= ?").join(" OR ") + ")";
      mins.forEach((b) => params.push(b));
    }

    if (filters.budget_max) {
      const maxs = Array.isArray(filters.budget_max) ? filters.budget_max : [filters.budget_max];
      q += " AND (" + maxs.map(() => "price <= ?").join(" OR ") + ")";
      maxs.forEach((b) => params.push(b));
    }

    return { q, params };
  });

  const unionQuery = queries.length === 1
    ? queries[0].q
    : queries.map((x) => x.q).join(" UNION ALL ");

  const fullQuery = `${unionQuery} ORDER BY price ASC LIMIT ${filters.limit || 20}`;
  const allParams = queries.flatMap((x) => x.params);

  return { fullQuery, allParams };
}


// --- API handler ---
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, countryCode = "IN" } = req.body;

  try {
    let filters = await extractFilters(message, countryCode);

    // Fallback if AI fails
    if (!filters || Object.keys(filters).length === 0) filters = fallbackParse(message);

    const { fullQuery, allParams } = buildQuery(filters);

    if (!fullQuery) return res.status(200).json({
      reply: "I couldn’t detect a valid category or city. Can you be more specific?",
      filters, results: []
    });

    if (DEBUG) {
      console.log("🟦 SQL Query:", fullQuery);
      console.log("🟦 Params:", allParams);
    }

    const results = await executeQuery(fullQuery, allParams, countryCode);

    const previewCount = filters.limit ? Math.min(filters.limit, 5) : 3;
    const preview = results.slice(0, previewCount).map((r) => ({
      id: r.id,
      medianame: r.medianame,
      city: r.city || r.city_name,
      price: Number(r.price),
      thumbnail: r.thumbnail,
      category: r.category_name,
      source: r.source,
    }));

    const reply = results.length
      ? `I found ${results.length} media options${filters.city ? ` in ${filters.city}` : ""}${filters.budget_min ? ` above ₹${filters.budget_min}` : ""}${filters.budget_max ? ` under ₹${filters.budget_max}` : ""}${filters.category ? ` for ${filters.category}` : ""}. Showing top ${preview.length}:`
      : "Sorry, I couldn’t find any matching media options.";

    return res.status(200).json({
      reply,
      filters,
      results: preview,
      debug: DEBUG ? { sql: fullQuery, params: allParams } : undefined,
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ reply: "Server error." });
  }
}
