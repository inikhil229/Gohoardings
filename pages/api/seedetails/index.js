import nc from "next-connect";
import error from "@/server/utils/error";
import { product } from "@/server/controller/product";
import { verifyToken } from "@/server/middelware/token";

const handler = nc(error);
handler.post(product);

export default handler;
