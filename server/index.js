import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {PORT} from "./config/index.js"
import { errorMiddleware } from "./middlewares/error.js";
import {authRoutes, productRoutes} from "./router/allRoutes.js";
import connectDB from "./db/connect.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser())

connectDB();

//error middleware
app.use(errorMiddleware)

app.use('/api/v1',authRoutes);
app.use('/api/v1',productRoutes);

const server = app.listen(PORT,() => {
    console.log(`Server is  running on port ${PORT} `);
    
});


process.on('unhandleRejection',(err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1);
    })
})


process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1);
    })
});


