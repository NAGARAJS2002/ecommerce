import multer from "multer";
import{errorHandler} from "../utils/errorHandler.js"
const storage = multer.diskStorage({});

const uploadMiddleware = multer({
    storage: storage
}).single('avatar')

const uploadHandler = (req,res,next) => {
   uploadMiddleware(req,res,(err)=> {
    if (err instanceof multer.MulterError) {
        return next(new errorHandler('Multer Error',400))
    } else if (err) {
        return next(errorHandler('uknown Error',500))
    }
    next();
   })
}

export {uploadHandler};