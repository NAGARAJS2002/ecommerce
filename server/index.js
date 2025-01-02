import express from "express";
import bodyParser from "body-parser";
import {PORT} from "./config/index.js"
import { errorMiddleware } from "./middlewares/error.js";
import {authRoutes} from "./router/authRoute.js";
import connectDB from "./db/connect.js";

const app = express();
app.use(bodyParser.json())

connectDB();

//error middleware
app.use(errorMiddleware)

app.use('/api/auth',authRoutes)
app.listen(PORT,() => {
    console.log(`Server is  running on port ${PORT} `);
    
})