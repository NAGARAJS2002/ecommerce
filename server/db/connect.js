import mongoose from "mongoose"
import { MONGODB_URI } from "../config/index.js"


async function connectDB(next) {
    const uri = MONGODB_URI;
    try {
        if (uri === undefined) {
          throw new Error("'MONGODB_URI is not  defined");
            
       }
      mongoose.connect(uri).then(() => {
       console.log(' connected to mongoDB');
       
      })

    } catch (error) {
        console.log(error);
        
        next(error)
    }
}

export default connectDB;