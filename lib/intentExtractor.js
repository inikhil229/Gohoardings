import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractFilters(userQuery) {
  const prompt = `
You are a helper that extracts structured filters for media queries.
Convert the user's query into JSON with fields:
- category (string: hoarding, digital, mall, flight, etc.) or null
- city (string) or null
- max_price (number) or null
- min_price (number) or null
- min_footfall (number) or null
- isBooked (boolean) or null
- make_pdf (boolean) true if user asks for a plan/proposal, else false

If a field is not mentioned, return null.
Return ONLY valid JSON.
User query: "${userQuery}"
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
    temperature: 0,
  });

  let parsed;
  try {
    parsed = JSON.parse(response.choices[0].message.content || "{}");
  } catch (e) {
    parsed = {};
  }

  return parsed;
}
