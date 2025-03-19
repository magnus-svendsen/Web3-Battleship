import express from "express";
import { getOrGeneratePrivateKey, getUserInfo } from "../controllers/accountController";

const router = express.Router();

router.post("/privatekey", getOrGeneratePrivateKey);
router.post("/userinfo", getUserInfo);

export default router;
