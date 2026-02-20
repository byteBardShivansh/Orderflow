import { Router } from "express";
import {
  createOrderHandler,
  listOrdersHandler,
  cancelOrderHandler
} from "./order.controller";

const router = Router();

router.post("/", createOrderHandler);
router.get("/", listOrdersHandler);
router.post("/:id/cancel", cancelOrderHandler);

export default router;