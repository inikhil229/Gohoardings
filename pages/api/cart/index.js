import nc from 'next-connect'
import error from '@/server/utils/error'
import { addOnCart, campaineId, cartiemfromdb, deleteFromCart, getUserCartItem, processdCart } from '@/server/controller/cartItems'
import { verifyToken } from '@/server/middelware/token'


const handler = nc({error})
   handler.post(verifyToken,campaineId,processdCart)
   handler.patch(verifyToken,deleteFromCart)
   handler.put(addOnCart)
   handler.get(verifyToken, getUserCartItem, cartiemfromdb)
export default handler