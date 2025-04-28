import { Router } from "express";
import { VerificationRequestsController } from "../controllers/verificationRequests.controller";
import { UserGuard } from "../Middlewares/UserGuard";
import upload from "../../config/multer";

const router = Router();

router.get('/', VerificationRequestsController.findAll);
router.post('/', UserGuard, upload.single("file"), VerificationRequestsController.create);
router.delete('/:id', UserGuard, VerificationRequestsController.delete);

export default router;