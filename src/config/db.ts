import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Enable detailed MongoDB operation logging (insertOne, find, etc.)
    // mongoose.set("debug", true);

    const mongoUri = process.env.MONGO_URI as string;
    const dbName = process.env.MONGO_DB_NAME; // optional explicit db name override

    await mongoose.connect(mongoUri, dbName ? { dbName } : undefined);

    console.log(`✅ MongoDB connected`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
