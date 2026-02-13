import express from "express";
import { config } from "../shared/config";
import routes from "./routes";
import { correlation } from "./middleware/correlation";
import { errorHandler } from "./middleware/error-handler";
import { logger } from "../shared/logger";
import { rateLimit } from "./middleware/rateLimit";
const app = express();

app.use(express.json());
app.use(correlation);

app.use(routes);

app.use(errorHandler);
app.use(rateLimit);
app.listen(config.port, () => {
  logger.info("OrderFlow API started", {
    port: config.port
  });
});