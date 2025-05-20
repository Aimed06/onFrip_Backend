import { Router } from "express";
import { CategoryController } from "../controllers/categories.controller";
import { UserGuard } from "../Middlewares/UserGuard";

const router = Router();

// Get all categories
router.get("/", CategoryController.getAllCategories);

// Get category by id
router.get("/:id", CategoryController.getCategoryById);

// Get categories by name
router.post("/by-name", CategoryController.getCategoriesByName);

// Get categories by ids
router.post("/by-ids", CategoryController.getCategoriesByIds);

// Create new category
router.post("/", UserGuard, CategoryController.createCategory);

// Delete category
router.delete("/:id", UserGuard, CategoryController.deleteCategory);

export default router;