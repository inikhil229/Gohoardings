import nc from 'next-connect'
import error from '@/server/utils/error'
import { checkOTP, sendOTP, sendPasswordEmail } from '@/server/controller/otp'
import { SiteMapProduct } from '@/server/sitemapdata'


const handler = nc({error})
  handler.patch(sendOTP)
  handler.put(sendPasswordEmail)
  handler.get(checkOTP)
  handler.post(SiteMapProduct)
export default handler