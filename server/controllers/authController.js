import{ User} from "../models/userModel.js"
import { sendToken } from "../utils/token.js";
import {errorHandler} from "../utils/errorHandler.js"
import v2 from "../utils/cloudinary.js";
//register 
export const register =  async (req,res,next) => {
    const {username, email, password} = req.body;
     try {
      const file = req.file;
      console.log(file);
      
      if (!file) {
          return next(new errorHandler('please upload a file',400));
      }
      const imagePath = file.path;
      const uploadFile = await v2.uploader.upload(imagePath,{
         folder: 'avatar'
      });
            
        const user = await User.create({
            username,
            email,
            password,
            avatar: uploadFile.secure_url});
           
          sendToken(user,201,res);
            
     } catch (error) {
        next(error)
     }

}
//login
export const login = async (req,res,next) => {
   try {
      const {email, password} = req.body;
      if (!email || !password) {
         return next(errorHandler('please enter email and password',400))
      }
      const user = await User.findOne({email:email}).select('+password')
      if(!user){
         return next(new errorHandler(' invalid email or password',401));
      }
      if(!await user.isValidPassword(password)){
         return next(new errorHandler('Invalid email or password', 401))
     }

     sendToken(user, 201 , res)
      
   } catch (error) {
      next(error)
   }
}

//logout
export const logout  = async (req,res,next) => {
  try {
   res.cookie('access_token',null, {
      expires: new Date(Date.now()),
      httpOnly: true
  })
  .status(200)
  .json({
      success: true,
      message: "Logged out"
  });
  } catch (error) {
   next(error)
  }
}
//getUser
export const getUserDetails = async (req, res, next) => {
  try {
     
   const user = await User.findById(req.user.id);

   res.status(200).json({
       success: true,
       user,
   });
  } catch (error) {
   next(error)
  }
};

//changePassword

export const changePassword = async (req,res,next) => {
   try {
        const user  = await User.findById(req.user.id).select('+password');
        if (!await user.isValidPassword(req.body.oldPassword)) {
             return next(new errorHandler(new 'old password is  incorrect', 401))
        }
       user.password = req.body.password;
        await user.save();
        res.status(200).json({
         success: true
        })
   } catch (error) {
      next(error)
   }
}

//update user profile 

export const updateProfile = async (req, res, next) => {
try {
      const newUserData = {
         username: req.body.username,
         email: req.body.email
      }
     const file = req.file;
     if (file !== "") {
       const user = await User.findById(req.user.id);
        await v2.uploader.destroy(user.avatar);

       const  imagePath = file.path;
        const uploadFile = await v2.uploader.upload(imagePath,{
         folder: "avatar"
        });

        newUserData.avatar = uploadFile.secure_url
     }

     await User.findByIdAndUpdate(req.user.id , newUserData,{
      new: true,
      runValidators: true,
      useFindAndModify: true,
     });
     res.status(200).json({
      success: true,
  });
} catch (error) {
   next(error)
}
};

export const getAllUsers = async (req, res, next) => {
   try {
      const users = await User.find();
   res.status(200).json({
        success: true,
        users
   })
   } catch (error) {
      next(error)
   }
}


export const getUser = async (req,res,next) => {
   try {
      const user = await User.findById(req.params.id);
      if(!user) {
          return next(new errorHandler(`User not found with this id ${req.params.id}`))
      }
      res.status(200).json({
          success: true,
          user
     })
      
   } catch (error) {
      next(error)
   }
}


export const updateUser = async (req,res,next) => {
   try {
      const newUserData = {
         name: req.body.name,
         email: req.body.email,
         role: req.body.role
     }
 
     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
         new: true,
         runValidators: true,
     })
 
     res.status(200).json({
         success: true,
         user
     })
   } catch (error) {
      next(error)
   }
}

export const deleteUser = async (req,res,next) => {
   try {
      const user = await User.findById(req.params.id);
      if(!user) {
          return next(new errorHandler(`User not found with this id ${req.params.id}`))
      }
      await user.deleteOne();
      res.status(200).json({
          success: true,
      })
   } catch (error) {
      next(error)
   }
}
