import nc from 'next-connect'
import error from '@/server/utils/error'
import {allCity } from '@/server/sitemapdata'



const handler = nc({error})
handler.get(allCity)

export default handler