import mongoose from "mongoose";
import app from "./app.js";
import logger from "./config/logger.config.js";


const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 4000;

mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error:${err}`);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    logger.info("Connected to MongoDB");
  });

let server;

server = app.listen(PORT, () => {
  logger.info(`server is listening at ${PORT}`);
  console.log("process =>", process.pid);
});

//handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server Closed");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexprctdErroHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexprctdErroHandler);
process.on("unhandledRejection", unexprctdErroHandler);
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server Closed");
    process.exit(1);
  }
});
