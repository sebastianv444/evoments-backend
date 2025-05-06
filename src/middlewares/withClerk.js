import { getAuth } from "@clerk/express";

export default function withClerk(req, res, next) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.auth = { userId };
  next();
}
