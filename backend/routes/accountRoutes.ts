import express from "express";
import { getOrGeneratePrivateKey } from "../controllers/accountController";

const router = express.Router();

router.post("/privatekey", getOrGeneratePrivateKey);

export default router;
