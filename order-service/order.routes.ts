import { Router } from "express";
import {
  createOrderHandler,
  listOrdersHandler
} from "./order.controller";

const router = Router();

router.post("/", createOrderHandler);
router.get("/", listOrdersHandler);

export default router;