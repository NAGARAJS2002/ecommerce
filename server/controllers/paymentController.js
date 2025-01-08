import Stripe  from "stripe"
import { STRIPE_API_KEY, STRIPE_SECRET_KEY } from "../config/index.js"
const stripe = new Stripe(STRIPE_SECRET_KEY)
export const processPayment = async (req,res,next) => {
   try {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: "accept_payment"},
        shipping: req.body.shipping
    })

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
   } catch (error) {
    next(error)
   }
}

export const sendStripeAPI = async (req,res,next) => {
    try {
        res.status(200).json({
            stripeApiKey: STRIPE_API_KEY
        })
    } catch (error) {
        next(error)
    }
}