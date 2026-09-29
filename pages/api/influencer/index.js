import nc from 'next-connect'
import error from '@/server/utils/error'
import { influencerAll, influencerForm} from '@/server/controller/influencer'


const handler = nc({error})
  handler.post(influencerForm)
  handler.get(influencerAll)
export default handler