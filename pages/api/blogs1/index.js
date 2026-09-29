import { executeQuery } from "@/server/conn/conn";
import catchError from "@/server/middelware/catchError";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "GET":
      blogs(req, res);
      break;
    case "PATCH":
      blogwithUrl(req, res);
      break;
    case "PUT":
      incrsblogPop(req, res);
      break;
    case "POST":
      generateManagePgBlog(req, res);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}

export const blogs = catchError(async (req, res) => {
  try {
    const qry = `
      SELECT title, url, image, blogCategory, keywords, summary, created_by,
             CreatedOn, UpdatedOn, content, popularity
      FROM gohoardings_blog 
      WHERE blog_for = 'pghive' 
        AND blogCategory = 'for-woner' 
        AND active = 1 
      ORDER BY id DESC
    `;
    const data = await executeQuery(qry, [], "CRM");

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export const blogwithUrl = catchError(async (req, res) => {
  try {
    const { url } = req.body;
    let qry = `
      SELECT title, url, popularity, image, blogCategory, keywords, summary, 
             created_by, CreatedOn, content
      FROM gohoardings_blog 
      WHERE blog_for = 'pghive' 
        AND url = '${url}'
      ORDER BY id DESC LIMIT 1
    `;
    let data = await executeQuery(qry, [], "CRM");

    if (data.length === 1) {
      const updateQry = `
        UPDATE gohoardings_blog 
        SET popularity = popularity + 1 
        WHERE blog_for = 'pghive' AND url = '${url}'
      `;
      await executeQuery(updateQry, [], "CRM");
    }

    if (data.length > 0) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(404).json({ success: false, message: "No blogs found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export const incrsblogPop = catchError(async (req, res) => {
  try {
    const { url } = req.body;
    const qry = `
      UPDATE gohoardings_blog 
      SET popularity = popularity + 1 
      WHERE blog_for = 'pghive' AND url = '${url}'
    `;
    const data = await executeQuery(qry, [], "CRM");

    if (data.affectedRows > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: "No blogs found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// 🧠 New: Generate blog using Perplexity API
export const generateManagePgBlog = catchError(async (req, res) => {
  try {
    const perplexityKey = process.env.PERPLEXITY_API_KEY;
    if (!perplexityKey) {
      return res.status(500).json({ success: false, message: "Missing Perplexity API key" });
    }

    const blogKeywords = req.body.keywords || "PG trends, student housing, rental budgets, local area news";
    const prompt = `
      Generate a detailed blog post for my website 'managepg' based on the latest local PG (Paying Guest) and rental trends.
      Include:
      - A catchy title
      - A short SEO-friendly summary (max 1 paragraph)
      - A URL slug (kebab-case, no spaces)
      - A 5-paragraph blog with headings, covering:
        1. Emerging PG rental trends
        2. Budget and affordability analysis
        3. Popular localities and their updates
        4. Tips for PG seekers
        5. Predictions for coming months
      Make the tone informative and suitable for property management audience in India.
    `;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await response.json();
    const output = result?.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({ success: false, message: "Failed to generate blog" });
    }

    // Simple parsing (you can fine-tune based on actual response)
    const titleMatch = output.match(/Title\s*[:\-]\s*(.*)/i);
    const summaryMatch = output.match(/Summary\s*[:\-]\s*(.*)/i);
    const urlMatch = output.match(/URL\s*[:\-]\s*(.*)/i);

    const title = titleMatch ? titleMatch[1].trim() : "PG Trends and Insights";
    const summary = summaryMatch ? summaryMatch[1].trim() : "";
    const url = urlMatch
      ? urlMatch[1].trim().toLowerCase().replace(/\s+/g, "-")
      : title.toLowerCase().replace(/\s+/g, "-");

    const content = output.replace(/^(Title|Summary|URL)[:\-].*$/gim, "").trim();

    // 🗄️ Save to DB
    const insertQry = `
      INSERT INTO gohoardings_blog 
      (title, url, blogCategory, blog_for, summary, content, keywords, created_by, active)
      VALUES (?, ?, 'pg-trends', 'managepg', ?, ?, ?, 'AI Bot', 1)
    `;

    await executeQuery(insertQry, [title, url, summary, content, blogKeywords], "CRM");

    return res.status(200).json({ success: true, title, url, summary });
  } catch (error) {
    console.error("Perplexity blog error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate blog" });
  }
});
