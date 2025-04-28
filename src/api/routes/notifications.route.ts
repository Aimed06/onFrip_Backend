import { Router } from "express";
import NotificationsController from "../controllers/notifications.controller"
import { UserGuard } from "../Middlewares/UserGuard";

const router = Router();

router.get("/", UserGuard, NotificationsController.findAll);
router.get("/:id/markAsSeen", UserGuard, NotificationsController.markAsSeen);

// router.post("/", UserGuard, NotificationsController.create);
// router.get("/:id", UserGuard, NotificationsController.findOne);

router.delete("/:id", UserGuard, NotificationsController.delete);

export default router;