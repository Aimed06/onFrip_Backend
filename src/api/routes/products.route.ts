import { Router } from "express";
import {ProductsController} from "../controllers/products.controller";
import { favoritesController } from "../controllers/favorites.controller";
import upload from "../../config/multer";
import { UserGuard } from "../Middlewares/UserGuard";
import { basketsController } from "../controllers/basket.controller";
const router = Router();


// Get all products
router.get("/", ProductsController.findAll);
router.post("/", [UserGuard, upload.single("image")], ProductsController.create);
// Get all products of a user
router.get("/user", UserGuard, ProductsController.getSellerProducts);
router.delete("/:id/user", UserGuard, ProductsController.deleteUserProduct);

router.get ("/favorites", UserGuard, favoritesController.getUserFavorites);
router.get("/:id/favorites", UserGuard, favoritesController.create);
router.delete("/:id/favorites", UserGuard, favoritesController.delete);

router.get("/basket", UserGuard, basketsController.getUserBaskets);
router.get("/:id/basket", UserGuard, basketsController.create);
router.delete("/basket", UserGuard, basketsController.deleteAll);
router.delete("/basket/:id", UserGuard, basketsController.delete);




// Get product by ID
router.get("/:id", ProductsController.findOne);
// Create a product
// Update a product
router.put("/:id", [UserGuard, upload.single("image")], ProductsController.update);
// Delete a product
router.delete("/:id", ProductsController.delete);
// Add a product to favorites

export default router
