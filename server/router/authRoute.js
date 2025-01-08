import express from "express";
import multer from "multer";
import { changePassword,
     deleteUser,
     getAllUsers,
     getUser, 
    getUserDetails, 
    login, 
    logout,
     register,
    updateProfile, 
    updateUser} from "../controllers/authController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const authRoutes = express.Router();
//multer storages
const storage = multer.diskStorage({});

const upload = multer({
    storage: storage
})

authRoutes.post('/register', upload.single('avatar'), register )
authRoutes.post('/login',login,)
authRoutes.get('/logout', logout,)
authRoutes.get('/getUser', isAuthenticatedUser, getUserDetails);
authRoutes.put('/passwordChange',isAuthenticatedUser, changePassword);
authRoutes.put('/updateProfile', isAuthenticatedUser, upload.single('avatar'), updateProfile);

//admin
authRoutes.get('/admin/users', isAuthenticatedUser,authorizeRoles('admin'),getAllUsers);
authRoutes.get('/admin/user/:id', isAuthenticatedUser,authorizeRoles('admin'),getUser);
authRoutes.put('/admin/update/:id', isAuthenticatedUser,authorizeRoles('admin'),updateUser);
authRoutes.delete('/admin/delete/:id', isAuthenticatedUser,authorizeRoles('admin'),deleteUser);

export  {authRoutes};