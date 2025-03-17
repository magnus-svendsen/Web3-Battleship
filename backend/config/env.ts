import dotenv from "dotenv";
dotenv.config();

export const {
  DB_CONNECTION_STRING,
  FRONTEND_URL,
  VIPPS_CLIENT_ID,
  VIPPS_CLIENT_SECRET,
  VIPPS_REDIRECT_URI,
  VIPPS_AUTH_URL,
  VIPPS_TOKEN_URL,
  VIPPS_USERINFO_URL,
} = process.env;