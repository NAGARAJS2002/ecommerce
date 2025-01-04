import express from "express";
import { changePassword, getUserDetails, login, logout, register, updateProfile } from "../controllers/authController.js";
import {  uploadHandler } from "../utils/multer.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const authRoutes = express.Router();

authRoutes.post('/register', uploadHandler, register )
authRoutes.post('/login',login,)
authRoutes.get('/logout', logout,)
authRoutes.get('/getUser', isAuthenticatedUser, getUserDetails);
authRoutes.put('/passwordChange',isAuthenticatedUser, changePassword);
authRoutes.put('/updateProfile',isAuthenticatedUser,updateProfile);

export  {authRoutes};