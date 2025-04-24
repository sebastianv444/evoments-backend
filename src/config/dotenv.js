import "dotenv/config";

const environments = {
  app: {
    port: process.env.PORT || 3000,
  },
};

export default environments;
