import { NextFunction } from "express";
import { ProductService } from "../services/products.service";
import { HttpError, HttpErrors } from "../errors/httpErrors";
import { UserService } from "../services/users.service";
import { UserRole } from "../entities/User.entity";
import { CategoryService } from "../services/categories.service";





export class ProductsController {
    public static async findAll(req: any, res: any, next:NextFunction) {
        try {
            const products = await ProductService.findAll();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }
    public static async findOne(req: any, res: any, next: NextFunction) {
        const id= parseInt(req.params.id)
        try {
            const product = await ProductService.findOne(id);
            if (!product) throw new HttpErrors.NotFound(`Product with id ${id} not found`);
            
            res.json(product);
        } catch (error) {
            next(error);
        }
    }
    public static async create(req: any, res: any, next: NextFunction) {
        try {
            // const user = req.locals.user;
            // console.log("ee",user);
            const { name, price, category } = req.body;
            const image = req.file?.filename;
            const user = res.locals.user;
            if (user.role != UserRole.VENDOR) throw new HttpErrors.Forbidden("Only vendors can create products");
            if (!user) throw new HttpErrors.NotFound(`User with id ${user.id} not found`);

            if (!name) throw new HttpErrors.BadRequest("Name is required");
            if (!price) throw new HttpErrors.BadRequest("Price is required");
            console.log(price)
            if (!image) throw new HttpErrors.BadRequest("Image is required");
            console.log(image)

            if (!category) throw new HttpErrors.BadRequest("Category is required");
            // Check if the user exists
            // if (!userId) throw new HttpErrors.BadRequest("User ID is required");
            const productCategory= await CategoryService.findById(category);
            if (!productCategory) throw new HttpErrors.NotFound(`Category with id ${category} not found`);
            const product = await ProductService.create({
                name,
                price,
                image,
                productCategory,
                
            }, user);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }
    public static async update(req: any, res: any, next: NextFunction) {
        const id = parseInt(req.params.id);
        try {;

            const { name, price, category } = req.body;
            const image = req.file?.filename;
            const user = req.locals.user;
            if (user.role !== UserRole.VENDOR) throw new HttpErrors.Forbidden("Only vendors can update products");
            const data = {  name, price, image, category };
            const product = await ProductService.update(id,data);
            if (!product) throw new HttpErrors.NotFound(`Product with id ${id} not found`);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }
    public static async delete(req: any, res: any, next: NextFunction) {
        const id = parseInt(req.params.id);
        try {
            const user = req.locals.user;
            if (user.role !== "vendor") throw new HttpErrors.Forbidden("Only vendors can delete products");
            const product = await ProductService.delete(id);
            if (!product) throw new HttpErrors.NotFound(`Product with id ${id} not found`);
            res.json({ message: `Product with id ${id} deleted` });
        } catch (error) {
            next(error);
        }
    }

    // get seller products
    public static async getSellerProducts(req: any, res: any, next: NextFunction) {
        const id = parseInt(res.locals.user.id);
        console.log(id);
        try {
            const user = await UserService.findOne(id);
            if (!user) throw new HttpErrors.NotFound(`user with id ${id} not found`);
            const products = await ProductService.findSellerProducts(id)
            if (!products) throw new HttpErrors.NotFound(`user with id ${id} has no products`);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }
    public static async deleteUserProduct(req: any, res: any, next: NextFunction) {
        const id = parseInt(req.params.id);
        try {
            const user = res.locals.user;
            if (!user) throw new HttpErrors.NotFound(`User with id ${user.id} not found`);
            const product = await ProductService.deleteUserProduct(id, user.id);
            if (!product) throw new HttpErrors.NotFound(`Product with id ${id} not found`);
            res.json({ message: `Product with id ${id} deleted` });
        } catch (error) {
            next(error);
        }
    }


}
