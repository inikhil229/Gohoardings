import nc from 'next-connect'
import error from '@/server/utils/error'
import { companyStaff } from '@/server/controller/staticPageControl'
import { mapMarkersData } from '@/server/controller/allfilters'
import { NearproductByLocation } from '@/server/controller/product'
import {metaLink } from '@/server/sitemapdata'


const handler = nc(error)
    handler.get(companyStaff)
    handler.post(mapMarkersData)
    handler.put(NearproductByLocation)
export default handler