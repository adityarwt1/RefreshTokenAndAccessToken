import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "AccessToken",
    });
  } catch (error) {
    console.log((error as Error).message);
  }
};
