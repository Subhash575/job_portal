// This code is a function that connects your Node.js application to a MongoDB database using the Mongoose library.
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
