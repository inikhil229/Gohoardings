import nc from 'next-connect'
import error from '@/server/utils/error'
import { googleLogin, linkdinLogin, logout } from '@/server/controller/REGISTERlOGIN'
import { verifyToken } from '@/server/middelware/token'


const handler = nc({error})
handler.put(linkdinLogin)
   handler.post(googleLogin)
   handler.get(verifyToken, logout)
export default handler