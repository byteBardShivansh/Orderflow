import { Router } from "express";
import orderRoutes from "../order-service/order.routes";
import { loginHandler } from "../auth-service/auth.controller";
import { authenticate } from "./middleware/auth";

const router = Router();

// Public route
router.post("/login", loginHandler);

// Protected routes
router.use("/orders", authenticate, orderRoutes);

export default router;