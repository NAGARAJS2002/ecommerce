import express from "express";
import multer from "multer";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { createProduct, 
        createReview, 
        deleteProduct, 
        deleteReview, 
        getAdminProducts,
        getProducts, 
        getProductsDetails, 
        getReviews, 
        UpdateProduct} from
        "../controllers/productController.js";

const productRoutes = express.Router();
//multer storages
const storage = multer.diskStorage({});

const upload = multer({
    storage: storage
})
productRoutes.get('/products/all',getProducts)
productRoutes.get('/product/:id',getProductsDetails);
productRoutes.put('/product/review',isAuthenticatedUser,createReview);
productRoutes.get('/admin/reviews',isAuthenticatedUser,getReviews);
productRoutes.delete('/review/delete',isAuthenticatedUser,deleteReview);
//admin
productRoutes.post('/admin/product/new',isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),createProduct);
productRoutes.get('/admin/products',isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts)
productRoutes.put('/admin/product/:id',isAuthenticatedUser,authorizeRoles("admin"),upload.array('images'),UpdateProduct);
productRoutes.delete('/admin/product/:id',isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),deleteProduct);

export {productRoutes};