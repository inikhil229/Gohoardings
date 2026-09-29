import nc from 'next-connect'
import error from '@/server/utils/error'
import { getReview, message, review } from '@/server/controller/enquiry'
import { Nearproduct } from '@/server/controller/product'


const handler = nc({error})
   handler.post(message)
   handler.get(getReview)
   handler.put(review)
   handler.patch(Nearproduct)
export default handler