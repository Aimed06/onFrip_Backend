import { Router } from "express";
import { OrderController } from "../controllers/orders.controller";
import { UserGuard } from "../Middlewares/UserGuard";



const router = Router();
// Get all orders
router.get("/", UserGuard, OrderController.getUserOrders);
// Get order by id
router.get("/seller", UserGuard, OrderController.getSellerOrders);
router.get("/:id", UserGuard, OrderController.findOne);
router.get("/:id/sales",UserGuard,OrderController.getSellerSalesStats);
// get all order of seller
router.patch("/:id", UserGuard, OrderController.cancelOrder);
router.patch("/:id/status", UserGuard, OrderController.updateOrderStatus)
router.post("/", UserGuard, OrderController.create);

router.get("/markAsPaid/:id", UserGuard, OrderController.markOrderAsPaid)

export default router