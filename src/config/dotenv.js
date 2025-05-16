import "dotenv/config";

const environments = {
  app: {
    port: process.env.PORT || 4000,
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
};

export default environments;
