import express from "express";
import { authWithVipps } from "../controllers/authController";

const router = express.Router();

router.get("/vipps", authWithVipps);

export default router;
