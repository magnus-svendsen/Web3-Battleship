import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "./env";

const connectDB = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_STRING as string);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database connection failed", error);
    }
};

export default connectDB;
