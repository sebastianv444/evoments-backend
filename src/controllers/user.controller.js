import { syncUser } from "../models/user.model.js";

export async function syncUserHandler(req, res) {
  try {
    console.log("Estoy en el cotrolador!");
    console.log(req.body);
    const { clerkId, email, firstName, lastName, phoneNumber } = req.body;

    const user = await syncUser({
      clerkId,
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ error: true, msj: err });
  }
}
