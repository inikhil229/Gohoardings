// lib/perplexity.js
const axios = require("axios");

const perplexity = axios.create({
  baseURL: "https://api.perplexity.ai/chat/completions",
  headers: {
    "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    "Content-Type": "application/json"
  }
});

async function generateSQL(userQuery, tableSchema) {
  const prompt = `
You are an AI that converts natural language to SQL queries.
The table is named "media" with fields: 
${tableSchema.join(", ")}

User request: "${userQuery}"

Return only the SQL query, no explanations.
  `;

  const response = await perplexity.post("", {
    model: "sonar-pro",   // Perplexity Pro model
    messages: [{ role: "user", content: prompt }]
  });

  const sqlQuery = response.data?.choices?.[0]?.message?.content?.trim();
  return sqlQuery;
}

module.exports = { generateSQL };
