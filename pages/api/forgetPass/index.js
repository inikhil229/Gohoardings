import nc from 'next-connect'
import error from '@/server/utils/error'
import { changePassword, checkOTP} from '@/server/controller/otp'
import { verifyToken } from '@/server/middelware/token'
import { useritems } from '@/server/controller/cartItems'


const handler = nc({error})
  handler.patch(checkOTP)
  handler.put(changePassword)
  handler.get(verifyToken, useritems)
export default handler