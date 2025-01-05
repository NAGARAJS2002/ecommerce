import { JWT_SECRET } from "../config/index.js";
import { errorHandler } from "../utils/errorHandler.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken"
export const isAuthenticatedUser = async (req,res,next) => {
    const {access_token} = req.cookies;
    if (!access_token) {
        return next(new errorHandler('unauthorized',401))
    }
    const decoded = jwt.verify(access_token,JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()  
    
}

export const authorizeRoles = (...roles) => {
    return  (req, res, next) => {
         if(!roles.includes(req.user.role)){
             return next(new errorHandler(`Role ${req.user.role} is not allowed`, 401))
         }
         next()
     }
 }


