import env from "dotenv";
env.config();

export const PORT = process.env.PORT  
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_TIME = process.env.JWT_EXPIRES_TIME
export const COOKIE_EXPIRES_TIME = process.env.COOKIE_EXPIRES_TIME
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

