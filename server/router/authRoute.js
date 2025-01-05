import express from "express";
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
import {  uploadHandler } from "../utils/multer.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const authRoutes = express.Router();

authRoutes.post('/register', uploadHandler, register )
authRoutes.post('/login',login,)
authRoutes.get('/logout', logout,)
authRoutes.get('/getUser', isAuthenticatedUser, getUserDetails);
authRoutes.put('/passwordChange',isAuthenticatedUser, changePassword);
authRoutes.put('/updateProfile', isAuthenticatedUser, uploadHandler, updateProfile);

//admin
authRoutes.get('/admin/users', isAuthenticatedUser,authorizeRoles('admin'),getAllUsers);
authRoutes.get('/admin/user/:id', isAuthenticatedUser,authorizeRoles('admin'),getUser);
authRoutes.put('/admin/update/:id', isAuthenticatedUser,authorizeRoles('admin'),updateUser);
authRoutes.delete('/admin/delete/:id', isAuthenticatedUser,authorizeRoles('admin'),deleteUser);

export  {authRoutes};