import "dotenv/config";

const environments = {
  app: {
    port: process.env.PORT || 4000,
    url_front: process.env.FRONTEND_URL || "http://localhost:5173",
  },
  ticketmaster: {
    apiKey: process.env.TM_API_KEY,
    baseUrl: "https://app.ticketmaster.com",
    discoveryPath: "/discovery/v2/events.json",
  },
  clerk: {
    apiPublishable: process.env.CLERK_PUBLISHABLE_KEY,
    apiKey: process.env.CLERK_SECRET_KEY,
    jwtUrl: process.env.CLERK_JWT_KEY,
  },
  cors: process.env,
  stripe: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookKey: process.env.STRIPE_WEBHOOK_SECRET,
  },
};

export default environments;
