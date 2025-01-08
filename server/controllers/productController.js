import { Product } from "../models/productsModel.js";
import v2 from "../utils/cloudinary.js";
import { errorHandler } from "../utils/errorHandler.js";

//get all products
export const getProducts = async (req,res,next) => {
     try {
        const products = await Product.find();
        res.status(200).json({
            success:true,
            products
        })
     } catch (error) {
        next(error)
     }
}

// Get Product Details
export const getProductsDetails = async (req,res,next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new errorHandler('Product not found',404))
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        next(error)
    }
}

// Get All Products --ADMIN
export const getAdminProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
};

//create products --ADMIN
export const createProduct = async (req,res,next) => {
    try {
        const file = req.files;
        let images = [];
        if (!file) {
            return next(new errorHandler('please upload a file',400));
        }
        for(let i=0 ; i< file.length; i++){
            const result = await v2.uploader.upload(file[i].path,{
                folder: "product"
            })
            images.push({image: result.secure_url,public_id:result.public_id})
        }

        req.body.images = images;
        req.body.user = req.user.id;

        const product = await Product.create(req.body)
        
        res.status(201).json({
            success: true,
            product
        })
         
              
       } catch (error) {
          next(error)
       }
};

//Update product --ADMIN

export const UpdateProduct = async (req,res,next) => {
    try {
        let product = await Product.findById(req.params.id);
        const file = req.files;
        console.log(file);
        if (file === undefined) {
            return next(new errorHandler('images not found'),400)
        }
         //
        for(let i=0 ;i< product.images.length; i++){
            await v2.uploader.destroy(product.images[i].public_id);
        };

        let images = [];

        for(let i=0 ;i< file.length; i++){
            const result = await v2.uploader.upload(file[i].path,{
                folder: "product"
            });
            images.push({image: result.secure_url,public_id: result.public_id})
        };

        req.body.images = images;
        req.body.user = req.user.id;

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            product
        })

        
    } catch (error) {
        next(error)
    }
}

//delete product --ADMIN

export const deleteProduct = async (req,res,next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new errorHandler("Product Not Found", 404));
        }
    
        for (let i = 0; i < product.images.length; i++) {
            await v2.uploader.destroy(product.images[i].public_id);
        }
    
        await product.deleteOne();
    
        res.status(201).json({
            success: true
        });
    } catch (error) {
        next(error)
    }
}

//Create Review  -api/v1/review

export const  createReview = async (req,res, next) => {
    try {
       const {productId,rating,comment} = req.body;
 
    const review = {
       user:req.user.id,
       rating,
       comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() === req.user.id.toString();
    });
    if(isReviewed){
        //updating the  review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        })

    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev
    });
    product.ratings = avg/product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
     });
    } catch (error) {
       next(error)
    }
 }

 //get all review of product

 export const getReviews = async (req,res,next) => {
   try {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new errorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
   } catch (error) {
    next(error)
   }
 }
 // delete reviews

 export const deleteReview = async (req,res,next) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return next(new errorHandler("Product Not Found", 404));
        }
    
        const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
    
        let avg = 0;
    
        reviews.forEach((rev) => {
            avg += rev.rating;
        });
    
        let ratings = 0;
    
        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }
    
        const numOfReviews = reviews.length;
    
        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews,
        }, {
            new: true,
            runValidators: true,
          
        });
    
        res.status(200).json({
            success: true,
        });

    } catch (error) {
        next(error)
    }
 }