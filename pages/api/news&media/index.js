import { executeQuery } from "@/server/conn/conn";
import catchError from "@/server/middelware/catchError";


export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "GET":
      news(req, res);
      break;
  }
}

export const news = catchError(async (req, res) => {
  try {
    const qry="SELECT * FROM gohoardings_news WHERE news_for = 'gohoarding' AND status=1 ORDER BY id DESC "

    const data = await executeQuery(qry,[],"CRM")
    if(data.length>0){
        return res
        .status(200)
        .json({ success: true,data });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});