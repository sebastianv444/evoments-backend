import { clerkMiddleware, requireAuth } from "@clerk/express";

export const clerkGlobal = clerkMiddleware();
export const clerkProtect = requireAuth();
