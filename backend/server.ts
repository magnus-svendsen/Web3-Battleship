import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import { handleVippsCallback } from "./controllers/authController"; 

const app = express();
const PORT = process.env.PORT || 5173;

connectDB();

app.use(bodyParser.json());
app.use(cors());

// Register Routes
app.use("/auth", authRoutes);    
app.use("/account", accountRoutes);
app.get("/", handleVippsCallback); // Fallback URL that Vipps uses is localhost:5173/


app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});
