import nc from 'next-connect'
import error from '@/server/utils/error'
import { ppt } from '@/server/controller/cartItems'
import { state_name } from '@/server/controller/mediaController'
import { goh_testimonials } from '@/server/controller/staticPageControl'
import { tawkto } from '@/server/controller/userdata'


const handler = nc({error})
   handler.put(ppt)
   handler.patch(state_name)
   handler.get(goh_testimonials)
   handler.post(tawkto)
export default handler