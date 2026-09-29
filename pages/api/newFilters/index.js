import nc from 'next-connect'
import error from '@/server/utils/error'
import { illuminationfilter, LocationFilter, subcategoryFilter } from '@/server/controller/allfilters'

export const config = {
  api: {
    responseLimit: false,
  },
}
const handler = nc({error})
  handler.patch(subcategoryFilter)
  handler.put(LocationFilter)
  handler.post(illuminationfilter)

export default handler