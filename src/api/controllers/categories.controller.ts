import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services/categories.service";
import { HttpErrors } from "../errors/httpErrors";
import { CreateCategoryCommand } from "../services/commands/categories/CreateCategoryCommand";
import { Category } from "../entities/Category.entity";

export class CategoriesController {
    // ----------------------------------- Get all categories -----------------------------------
    public static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryService.findAll();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Get category by id -----------------------------------
    public static async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw new HttpErrors.BadRequest("Category ID is required");

            const category = await CategoryService.findById(id);
            if (!category) throw new HttpErrors.NotFound("Category not found");

            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Create category -----------------------------------
    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { displayName, id } = req.body;
            if (!displayName) throw new HttpErrors.BadRequest("Display name is required");
            if (!id) throw new HttpErrors.BadRequest("Category ID is required");

            const categoryData: CreateCategoryCommand = {
                id,
                displayName,
            };

            const createdCategory = await CategoryService.create(categoryData);
            res.json(createdCategory);
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Delete category -----------------------------------
    public static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) throw new HttpErrors.BadRequest("Category ID is required");

            const deletedCategory = await CategoryService.delete(id);
            if (!deletedCategory.affected) throw new HttpErrors.NotFound("Category not found");

            res.json(`category with id ${id} deleted`);
        } catch (error) {
            next(error);
        }
    }

}

export default CategoriesController