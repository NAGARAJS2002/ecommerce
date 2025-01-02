import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_SECRET,JWT_EXPIRES_TIME } from "../config/index.js";
const userSchema  = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please enter username']
    },
    email:{
        type: String,
        required: [true,'Please enter email'],
        unique: true
    },
    password: {
        type:String,
        required: [true,'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters']
    },

    avatar: {
        type: String
    },
    role: {
        type : String,
        default: 'user'
    }

},{timestamps: true});


userSchema.pre('save', async function(){
    this.password = await bcryptjs.hash(this.password,10);
})

userSchema.methods.getJwtToken = function()  {
  return  jwt.sign({id : this.id}, JWT_SECRET,{
        expiresIn: JWT_EXPIRES_TIME
    })
       
}


const User = mongoose.model('user', userSchema);

export {User}

