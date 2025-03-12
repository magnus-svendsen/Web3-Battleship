import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import { handleVippsCallback } from "./controllers/authController"; 

const app = express();
const PORT = process.env.PORT || 5173;

// Connect to Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Register Routes
app.use("/auth", authRoutes);    // Vipps login remains under "/auth/vipps"
app.use("/account", accountRoutes);
app.get("/", handleVippsCallback);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});
