import express from "express";
import { config } from "../shared/config";
import routes from "./routes";
import { correlation } from "./middleware/correlation";
import { errorHandler } from "./middleware/error-handler";
import { logger } from "../shared/logger";
import { rateLimit } from "./middleware/rateLimit";

const app = express();

// If deployed behind a reverse proxy (e.g., NGINX), enable trust proxy for correct IPs
app.set("trust proxy", 1);

// Standard chain: json → correlation → rateLimit → routes → errorHandler
app.use(express.json());
app.use(correlation);
app.use(rateLimit);

// Health/root endpoints so GET / no longer returns "Cannot GET /"
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "orderflow-api-gateway",
    env: process.env.NODE_ENV ?? "development",
  });
});

// A simple liveness probe endpoint commonly used by orchestrators
app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

app.use(routes);

// Keep your custom error handler last to catch route/middleware errors
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info("OrderFlow API started", {
    port: config.port,
  });
});