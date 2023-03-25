import mongoose from "mongoose";
import config from "@root/config";
import logger from "@root/logger";

export default () => {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => logger("db").info("connected to db"))
    .catch((err) => logger("db").error(err));
};
