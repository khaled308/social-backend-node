import AppServer from "@root/server";
import express from "express";
import dbConnection from "@root/db";

class App {
  start() {
    const app = express();
    const server = new AppServer(app);
    server.start();
    dbConnection();
  }
}

const app = new App();
app.start();
