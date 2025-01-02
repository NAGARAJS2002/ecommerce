import{ User} from "../models/userModel.js"
import { sendToken } from "../utils/token.js";
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