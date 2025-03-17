import { Request, Response } from "express";
import axios from "axios";
import { generatePrivateKey } from "viem/accounts";
import Account from "../models/account";
import { VIPPS_USERINFO_URL } from "../config/env";

// Fetches or generates a new private key for user
export const getOrGeneratePrivateKey = async (req: Request, res: Response) => {
  try {
    const access_token = req.body["accesstoken"];

    const userInfoResponse = await axios.get(VIPPS_USERINFO_URL as string, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const sub = userInfoResponse.data.sub;
    let account = await Account.findOne({ sub });

    if (account) {
      res.status(200).json(account.privateKey);
    } else {
      const newPrivateKey = generatePrivateKey();
      account = await Account.create({ sub, privateKey: newPrivateKey });
      res.json(newPrivateKey);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve or create private key" });
  }
};
