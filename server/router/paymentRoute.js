import express from "express";
import {isAuthenticatedUser} from "../middlewares/auth.js"
import { processPayment, sendStripeAPI } from "../controllers/paymentController.js";
const paymentRoutes = express.Router();
paymentRoutes.put('/payment/process',isAuthenticatedUser,processPayment);
paymentRoutes.put('/stripeapi',isAuthenticatedUser,sendStripeAPI);

export {paymentRoutes}