import nc from 'next-connect'
import error from '@/server/utils/error'
import { excel } from '@/server/controller/cartItems'
import { getCityData, mediaData } from '@/server/controller/mediaController'
import { brangLogo } from '@/server/controller/enquiry'

export const config = {
   api: {
     responseLimit: false,
   },
 }
const handler = nc({error})
   handler.post(excel)
   handler.patch(mediaData)
   handler.put(getCityData)
   handler.get(brangLogo)
export default handler