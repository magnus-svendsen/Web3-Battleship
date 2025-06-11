import express from "express";
import { checkIfAddressIsVerified, getOrGeneratePrivateKey, getUserInfo } from "../controllers/accountController";

const router = express.Router();

router.post("/privatekey", getOrGeneratePrivateKey);
router.post("/userinfo", getUserInfo);
router.get("/checkVerified", checkIfAddressIsVerified)

export default router;
