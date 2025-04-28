import { Router } from "express";
import UsersController from "../controllers/users.controller";
import { AuthentificationController } from "../controllers/authentification.controller";

const router = Router();

router.get('/me', AuthentificationController.me);
router.post('/sendSecretCode', AuthentificationController.sendSecretCode);
router.post('/verifySecretCode', AuthentificationController.verifySecretCode);
router.post('/register', AuthentificationController.register);
router.post('/logout', AuthentificationController.logout);
router.post('/auth/google', AuthentificationController.authenticateWithGoogle);


export default router;
