import type { Request, Response } from "express";
import qs from "qs";
import axios from "axios";
import {
  VIPPS_CLIENT_ID,
  VIPPS_CLIENT_SECRET,
  VIPPS_REDIRECT_URI,
  VIPPS_AUTH_URL,
  VIPPS_TOKEN_URL,
  FRONTEND_URL
} from "../config/env";

// Handles user login with Vipps
export const authWithVipps = async (req: Request, res: Response) => {
  try {
    const nonce = "123hemmelig";
    const state = "321hemmelig";
    const scope = "phoneNumber sub name";

    const authParams = qs.stringify({
      client_id: VIPPS_CLIENT_ID,
      redirect_uri: VIPPS_REDIRECT_URI,
      response_type: 'code',
      scope,
      state,
      nonce
    });

    const authURL = `${VIPPS_AUTH_URL}?${authParams}`;
    res.redirect(authURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to initiate authentication" });
  }
};

export const handleVippsCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.send(`Vipps returned an error: ${error}`);
      return;
    }
    if (!code) {
      res.send("No code returned from Vipps");
      return;
    }

    const data = qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: VIPPS_REDIRECT_URI,
    });

    const tokenResponse = await axios.post(
      VIPPS_TOKEN_URL as string,
      data,
      {
        auth: {
          username: VIPPS_CLIENT_ID as string,
          password: VIPPS_CLIENT_SECRET as string,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = tokenResponse.data;
    res.redirect(`${FRONTEND_URL}?accesstoken=${access_token}`);
  } catch (error) {
    console.error(error);
    res.redirect(FRONTEND_URL!);
  }
};