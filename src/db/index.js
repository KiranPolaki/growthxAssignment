import mongoose from "mongoose";

// TODO: Run Mongodb via docker

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URl}/${process.env.DB_NAME}`
    );
    console.log(
      `\n MongoDB Connected to Database Host: ${connectionInstance?.connection?.host}`
    );
  } catch (error) {
    console.log("MongoDb connection Failed");
  }
};

export default connectDB;
