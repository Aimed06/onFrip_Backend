import { Router } from "express";
import UsersController from "../controllers/users.controller";
import { User } from "../entities/User.entity";

const router = Router();
// get users by admin
router.get('/', UsersController.findAll);
router.put('/:id',UsersController.update)

router.get('/:id', UsersController.findOne);
router.post('/', UsersController.create);

// get reservations by user

router.get('/:id', UsersController.findOne);


export default router;