  import {Order} from "../models/orderModel.js"
  import { errorHandler } from "../utils/errorHandler.js";
  import {Product} from "../models/productsModel.js"
  export const createOrder = async (req,res,next) => {
    try {
        const {orderItems,
             shippingInfo,
             itemsPrice,
             taxPrice,
             shippingPrice,
             totalPrice,
             paymentInfo} = req.body;

             const order = Order.create({
             orderItems,
             shippingInfo,
             itemsPrice,
             taxPrice,
             shippingPrice,
             totalPrice,
             paymentInfo,
             paidAt: Date.now(),
             user:req.user.id
             });
           res.status(201).json({
            success: true,
            order
           })

    } catch (error) {
          next(error)
    }
  }
  //get single order 

  export const getSingleOrder = async (req,res,next) => {
   try {
    const order =  Order.findById(req.params.id).populate('user', 'username email')
   if (!order) {
    return next(new errorH("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order
    })
  
   } catch (error) {
    next(error)
   }
  }

  //get loggedin  user orders 

  export const myOrders = async (req,res,next) => {
    try {
      const orders = await Order.find({user: req.user.id});
      res.status(200).json({
        success: true,
        orders
      })
    } catch (error) {
      next(error)
    }
  }

  //get all orders

  export const orders = async (req,res,next) => {
   try {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice
    });

    res.status(200).json({
      success:true,
      totalAmount,
      orders
    })
   } catch (error) {
    next(error)
   }
  }


//Admin update order/ order status

export const  updateOrder  = async (req,res,next) => {
     try {
      const order = await Order.findById(req.params.id);

      if(order.orderStatus == 'Delivered') {
          return next(new errorHandler('Order has been already delivered!', 400))
      }
      //Updating the product stock of each order item
      order.orderItems.forEach(async orderItem => {
          await updateStock(orderItem.product, orderItem.quantity)
      })
  
      order.orderStatus = req.body.orderStatus;
      order.deliveredAt = Date.now();
      await order.save();
  
      res.status(200).json({
          success: true
      })
     } catch (error) {
      next(error)
     }
}
 
async function updateStock (productId, quantity){
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({validateBeforeSave: false})
}

//delete order

export const deleteOrder = async (req,res,next) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order) {
        return next(new errorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    await order.deleteOne();
    res.status(200).json({
        success: true
    })
  } catch (error) {
    next(error)
  }
}