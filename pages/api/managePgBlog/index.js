import { executeQuery } from "@/server/conn/conn";
import catchError from "@/server/middelware/catchError";

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
  }
}

export const blogs = catchError(async (req, res) => {
  try {
    const qry =
      "SELECT title,url,image,blogCategory,keywords,summary,created_by,CreatedOn,UpdatedOn,content,popularity FROM gohoardings_blog WHERE blog_for = 'pghive' AND blogCategory = 'for-woner' AND active=1 ORDER BY id DESC ";
    const data = await executeQuery(qry, "gohoardi_crmapp");

    if (data.length > 0) {
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export const blogwithUrl = catchError(async (req, res) => {
  try {
    const { url } = req.body;

    let qry = `SELECT title, url,popularity, image, blogCategory, keywords, summary, created_by, CreatedOn, content FROM gohoardings_blog WHERE blog_for = 'pghive' AND url ='${url}' ORDER BY id DESC LIMIT 1`;
    let data = await executeQuery(qry, "gohoardi_crmapp");
  
    if(data.length===1){
    const qry = `UPDATE gohoardings_blog SET popularity = popularity + 1 WHERE blog_for = 'pghive' AND url ='${url}'`;
    let dat = await executeQuery(qry, "gohoardi_crmapp");
    }
     
    if (data.length === 0) {
      qry = `SELECT title, url,popularity, image, blogCategory, keywords, summary, created_by, CreatedOn, content FROM gohoardings_blog WHERE blog_for = 'pghive' AND url ='${url}' ORDER BY id DESC`;
      data = await executeQuery(qry, "gohoardi_crmapp");
    }

    if (data.length > 0) {
      return res.status(200).json({ success: true, data });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No blogs found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export const incrsblogPop = catchError(async (req, res) => {
  try {
    const { url } = req.body;
    const qry = `UPDATE gohoardings_blog SET popularity = popularity + 1 WHERE blog_for = 'pghive' AND url ='${url}'`;
    let data = await executeQuery(qry, "gohoardi_crmapp");

    if (data.affectedRows > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No blogs found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal serrver error" });
  }
});
