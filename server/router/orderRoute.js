import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { createOrder, deleteOrder, getSingleOrder, myOrders, orders, updateOrder } from "../controllers/orderController.js";

const orderRoutes = express.Router();
orderRoutes.post('/order/create',isAuthenticatedUser,createOrder);
orderRoutes.get('/order/:id',isAuthenticatedUser,getSingleOrder);
orderRoutes.get('/myorders',isAuthenticatedUser,myOrders);

//Admin Routes
orderRoutes.get('/orders',isAuthenticatedUser,authorizeRoles("admin"),orders);
orderRoutes.put('/order/:id',isAuthenticatedUser,authorizeRoles("admin"),updateOrder);
orderRoutes.delete('/order/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);


export {orderRoutes}