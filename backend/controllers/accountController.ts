import type { Request, Response } from "express";
import axios from "axios";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import Account from "../models/account";
import { VIPPS_USERINFO_URL } from "../config/env";

// Helper function to fetch user info
const fetchUserInfo = async (access_token: string) => {
  try {
    const userInfoResponse = await axios.get(VIPPS_USERINFO_URL as string, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return userInfoResponse.data;
  } catch (error) {
    throw new Error("Failed to fetch user info from Vipps API");
  }
};

// Fetches or generates a new private key for user
export const getOrGeneratePrivateKey = async (req: Request, res: Response) => {
  try {
    const access_token = req.body.accesstoken;

    const { sub, name } = await fetchUserInfo(access_token);

    let account = await Account.findOne({ sub });

    if (account) {
      res.status(200).json(account.privateKey);
    } else {
      const newPrivateKey = generatePrivateKey();
      const address = privateKeyToAccount(newPrivateKey).address;

      account = await Account.create({
        sub,
        privateKey: newPrivateKey,
        address,
        name,
      });
      res.json(newPrivateKey);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve or create private key" });
  }
};

// Fetches user info from Vipps
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const access_token = req.body.accesstoken;

    const userInfo = await fetchUserInfo(access_token);

    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user info" });
  }
};

export const checkIfAddressIsVerified = async (req: Request, res: Response) => {
  try {
    const address_to_check = req.query.address as string;
    const account = await Account.findOne({ address: address_to_check });
    if (account) {
      res.status(200).json({
        verified: true,
        name: account.name,
      });
    } else {
      res.status(404).json({
        verified: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
