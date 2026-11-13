// This code is a function that connects your Node.js application to a MongoDB database using the Mongoose library.
import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("mongodb connected successfully");
};
export default connectDB;
