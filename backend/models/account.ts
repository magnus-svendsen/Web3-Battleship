import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  // The sub is a unique identifier for a Vipps MobilePay user and relates to that user's consent to share information with a specific sales unit.
  // The sub will not change if a user removes their consents, logs in again, and re-consents.
  // https://developer.vippsmobilepay.com/docs/APIs/userinfo-api/userinfo-api-guide/
  
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
