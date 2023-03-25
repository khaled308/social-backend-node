import bunyan from "bunyan";

const logger = (name: string) => {
  return bunyan.createLogger({
    name: name,
    level: "debug",
  });
};

export default logger;
