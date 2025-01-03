import{ User} from "../models/userModel.js"
import { sendToken } from "../utils/token.js";
import {errorHandler} from "../utils/errorHandler.js"

export const register =  async (req,res,next) => {
    const {username, email, password} = req.body;
     try {
            
        const user = await User.create({
            username,
            email,
            password,
           });
           
          sendToken(user,201,res);
            
     } catch (error) {
        next(error)
     }

}

export const login = async (req,res,next) => {
   try {
      const {email, password} = req.body;
      if (!email || !password) {
         return next(errorHandler('please enter email and password',400))
      }
      const user = await User.findOne({email:email}).select('+password')
      if(!user){
         return next(errorHandler(' invalid email or password',401));
      }
      if(!await user.isValidPassword(password)){
         return next(new errorHandler('Invalid email or password', 401))
     }

     sendToken(user, 201 , res)
      
   } catch (error) {
      next(error)
   }
}