import { Router } from "express";
import {
  createOrderHandler,
  listOrdersHandler,
  cancelOrderHandler,
} from "./order.controller";
import { requireRole } from "../api-gateway/middleware/rbac";
import { Role } from "../shared/enums";

const router = Router();

// Only CUSTOMER users can create orders
router.post("/", requireRole(Role.CUSTOMER), createOrderHandler);

// Only ADMIN users can list all orders
router.get("/", requireRole(Role.ADMIN), listOrdersHandler);

// Only ADMIN users can cancel orders
router.post("/:id/cancel", requireRole(Role.ADMIN), cancelOrderHandler);

export default router;