import nc from 'next-connect'
import error from '@/server/utils/error'
import { categorieFilter, filterData, iconFilter, locationFilter } from '@/server/controller/allfilters'

const handler = nc(error)
    handler.get(categorieFilter)
    handler.post(locationFilter)
    handler.patch(iconFilter)
    handler.put(filterData)
export default handler