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

        const { access_token, id_token, refresh_token, token_type } = tokenResponse.data;

        const userInfoResponse = await axios.get(VIPPS_USERINFO_URL as string, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        res.redirect(FRONTEND_URL + `?accesstoken=${access_token as string}`);
    }
    catch (error) {
        console.error(error)
        res.redirect(FRONTEND_URL!);

    }
})


app.post("/test", async (req: Request, res: Response) => {
    try {
        const clientID = req.body["clientID"]
        const account = await Account.findOne({ clientID: clientID })
        if (account != null) {
            var privateKey = account.privateKey
            res.status(200).json(privateKey)
        } else {
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

app.post("/privatekey", async (req: Request, res: Response) => {
    try {
        const access_token = req.body["accesstoken"]


        // Validate using userinfo API
        const userInfoResponse = await axios.get(VIPPS_USERINFO_URL as string, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });


        const clientID = Number(userInfoResponse.data.nin)
        const account = await Account.findOne({ clientID: clientID })
        if (account != null) {
            var privateKey = account.privateKey
            res.status(200).json(privateKey)
        } else {
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

