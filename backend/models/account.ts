import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  sub: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  }
})

const Account = mongoose.model("Accounts", accountSchema, "accounts")
export default Account;
