import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { generatePrivateKey } from "viem/accounts"
import qs from "qs";
import axios from 'axios';
import cors from "cors"
import Account from "./models/account";
const app = express()
const port = 5173

const {
    DB_CONNECTION_STRING,
    FRONTEND_URL,
    VIPPS_CLIENT_ID,
    VIPPS_CLIENT_SECRET,
    VIPPS_REDIRECT_URI,
    VIPPS_AUTH_URL,
    VIPPS_TOKEN_URL,
    VIPPS_USERINFO_URL,
} = process.env

mongoose.connect(DB_CONNECTION_STRING!)
const db = mongoose.connection

db.on("error", (error) => {
    console.error(error)
})

db.once("open", () => console.log("Server connected to DB"))

app.use(bodyParser.json())
app.use(cors())

// You click the button to login with Vipps
app.get("/auth/vipps", async (req: Request, res: Response) => {
    try {
        //Should be randomly generated for secret stuffs
        const nonce = "123hemmelig"
        const state = "321hemmelig"

        //What data we want to fetch. Only phone to test
        const scope = "phoneNumber nin"

        const authParams = qs.stringify({
            client_id: VIPPS_CLIENT_ID,
            redirect_uri: VIPPS_REDIRECT_URI,
            response_type: 'code',
            scope,
            state,
            nonce
        })

        const authURL = `${VIPPS_AUTH_URL}?${authParams}`;
        res.redirect(authURL)
    }
    catch (error) {
        console.error(error)
    }
})

// Vipps redirects back to this URL with a code
app.get("/", async (req: Request, res: Response) => {
    try {
        const { code, error } = req.query;

        if (error) {
            res.send(`Vipps returned an error: ${error}`);
        }

        if (!code) {
            res.send('No code returned from Vipps');
        }

        const data = qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: VIPPS_REDIRECT_URI,
        });

        // Ask Vipps for an access token using the authorization code and Vipps client credentials
        // Vipps client credentials are the client ID and client secret
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

        // Redirect to frontend with access token
        // This is because we have not found a better way to pass the access token to the frontend
        res.redirect(FRONTEND_URL + `?accesstoken=${access_token as string}`);
    }
    catch (error) {
        console.error(error)
        res.redirect(FRONTEND_URL!);

    }
})

// Save the private key and nin to the database if the user does not already have one
app.post("/privatekey", async (req: Request, res: Response) => {
    try {
        const access_token = req.body["accesstoken"]

        // Validate using userinfo API
        const userInfoResponse = await axios.get(VIPPS_USERINFO_URL as string, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // TODO: Change variable name from clientID to nin. Need to change in the database as well
        const clientID = Number(userInfoResponse.data.nin)
        const account = await Account.findOne({ clientID: clientID })

        // If the user already has a private key, return it
        if (account != null) {
            var privateKey = account.privateKey
            res.status(200).json(privateKey)
        } else {
            // If the user does not have a private key, generate a new one and save it to the database
            var newPrivateKey = generatePrivateKey()
            await Account.create({
                clientID: clientID,
                privateKey: newPrivateKey
            })
            res.json(newPrivateKey)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

app.listen(port, () => console.log("Server Started, listening on PORT:", port))