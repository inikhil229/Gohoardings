// pages/api/ai-bot.js
import { createAgent } from "../../../lib/agent";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { query, countryCode } = req.body;

  try {
    const agent = await createAgent();

    // 🟢 Let the agent decide whether to call the queryDbTool
    const response = await agent.invoke({
      input: `User asked: "${query}".
      - Generate SQL query for MySQL and  call the "query-mysql" tool to execute the SQL and fetch results from our database only.
      - Return the final output as JSON:
        {
          "sql": "...",
          "countryCode": "${countryCode || "IN"}",
          "results": [...]
        }`,
    });

    res.status(200).json({
      answer: response.output, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chatbot error", details: err.message });
  }
}
