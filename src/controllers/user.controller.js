import { syncUser } from "../models/user.model.js";

export async function syncUserHandler(req, res) {
  try {
    const { clerkId, email, firstName, lastName, phoneNumber } = req.body;
    const tokenUserId = req.auth.userId;

    console.log(clerkId, email, firstName, lastName, phoneNumber);

    if (clerkId !== tokenUserId) {
      return res.status(403).json({ error: "User mismatch" });
    }

    const user = await syncUser({
      clerkId,
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(404).json({ error: true, msj: err });
  }
}
