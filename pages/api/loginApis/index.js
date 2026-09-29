import nc from 'next-connect'
import error from '@/server/utils/error'
import { getuser, login, register, registerLogin } from '@/server/controller/REGISTERlOGIN'
import { verifyToken } from '@/server/middelware/token'



const handler = nc({error})
   handler.patch(login)
   handler.post(register)
   handler.put(registerLogin)
   handler.get(verifyToken, getuser)
export default handler