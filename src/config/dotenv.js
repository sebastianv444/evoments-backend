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
  cors: process.env
};

export default environments;
