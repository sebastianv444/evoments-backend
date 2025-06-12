import Stripe from "stripe";
import environments from "../config/dotenv.js";

const stripe = new Stripe(environments.stripe.apiKey, {
  apiVersion: "2023-10-16",
});

export default stripe;