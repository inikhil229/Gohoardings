import { updateImage } from '@/server/controller/REGISTERlOGIN'
import { verifyToken } from '@/server/middelware/token'

const multer = require('multer')
const nc = require('next-connect')
const path = require('path')
const handle = nc()
export const config = {
    api: {
      bodyParser: false,
    },
  }
const imageConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/profile_image')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: imageConfig,
} )
const isImage = upload.single('file')
handle.use(isImage)
handle.post(verifyToken, updateImage)
export default handle