import nc from 'next-connect'
import error from '@/server/utils/error'
import { goh_faqs } from '@/server/controller/staticPageControl'
import { city, SearchData } from '../../../server/controller/mediaController'
import { editCart } from '@/server/controller/cartItems'
import { verifyToken } from '@/server/middelware/token'

const handler = nc(error)
    handler.patch(city)
    handler.post(SearchData)
    // handler.get(goh_faqs)
    handler.put(verifyToken, editCart);
export default handler