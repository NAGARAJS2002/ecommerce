import { JWT_SECRET } from "../config/index.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"
export const isAuthenticatedUser = (req,res,next) => {
    const {access_token} = req.cookies;
    if (!access_token) {
        return next(new errorHandler('unauthorized',401))
    }
    jwt.verify(access_token,JWT_SECRET,(err, user) => {
        if (err) {
            return next(new errorHandler('Forbidden',403))
        }
        req.user = user;
        next();
    })
    
    
}