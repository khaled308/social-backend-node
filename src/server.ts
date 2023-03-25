import express from "express";
import http from "http";
import hpp from "hpp";
import compression from "compression";
import cookieSession from "cookie-session";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import http_status from "http-status-codes";
import config from "@root/config";
import routes from "@root/routes";
import { CustomError, IErrorResponse } from "@global/helpers/error-handler";
import logger from "@root/logger";

class AppServer {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  securityMiddleware(app: express.Application) {
    app.use(
      cookieSession({
        name: "app-session",
        keys: [config.SECRET_KEY1, config.SECRET_KEY2],
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV != "development",
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
  }

  standardMiddleware(app: express.Application) {
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  }

  routeMiddleware(app: express.Application) {
    routes(app);
  }

  globalErrorHandler(app: express.Application) {
    app.all("*", (req, res) => {
      res.status(404).json({
        status: http_status.NOT_FOUND,
        message: "Not Found",
      });
    });

    app.use(
      (
        err: IErrorResponse,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err instanceof CustomError) {
          return res.status(err.status).json(err.serializeError());
        }

        return res.status(err.status || 500).json({
          status: err.status || 500,
          message: err.message,
        });
      }
    );
  }

  async startServer(app: express.Application): Promise<void> {
    try {
      const server = http.createServer(app);
      this.startHttpServer(server);
      await this.createSocketIo(server);
    } catch (err) {
      logger("setup server").error(err);
    }
  }

  async createSocketIo(http: http.Server): Promise<Server> {
    const io = new Server(http, {
      cors: {
        origin: "*",
      },
    });

    const pubClient = createClient({ url: config.REDIS_URI });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  startHttpServer(http: http.Server) {
    http.listen(8000, () => {
      logger("setup server").info("http://localhost:8000");
    });
  }
}

export default AppServer;
