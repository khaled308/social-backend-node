import dotenv from "dotenv";

dotenv.config({ path: "./env/dev.env" });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://mongodb:27017/social",
  SECRET_KEY1: process.env.SECRET_KEY1 || "",
  SECRET_KEY2: process.env.SECRET_KEY2 || "",
  REDIS_URI: process.env.REDIS_URI || "",
};
