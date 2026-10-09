const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { executeQuery } = require("./server/conn/conn");
const oneday = 24 * 60 * 60 * 1000;

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
// Increase the maximum number of listeners
require("events").EventEmitter.defaultMaxListeners = 25;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    // interval for generating the blog every 24 hours
    setInterval(async () => {
      await generateAndSaveBlog();
    }, oneday);
    if (err) throw err;
    console.log("> Ready on http://localhost:", process.env.PORT);
  });
});

async function generateAndSaveBlog() {
  try {
    const { GenerateBlog } =
      await import("./server/controller/GenerateBlog.js");

    const { title, url, keywords, summary, content, blogCategory } =
      await GenerateBlog();

    const query = `
      INSERT INTO gohoardings_blog
      (
        title,
        url,
        image,
        blogCategory,
        keywords,
        summary,
        created_by,
        CreatedOn,
        UpdatedOn,
        content,
        popularity
      )
      VALUES (?, ?, NULL, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
    `;

    await executeQuery(
      query,
      [title, url, blogCategory, keywords, summary, "gemini", content, 0],
      "CRM",
    );

    return;
  } catch (error) {
    console.error("Failed:", error.message);

    // Try again if LLM api fails
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return generateAndSaveBlog();
  }
}
