import { NextFunction, Request, Response } from "express";
import { FavoriteService } from "../services/favorites.service";
import { CreateFavoriteCommand } from "../services/commands/favorites/CreateFavoriteCommand";
import { UserService } from "../services/users.service";
import { ProductService } from "../services/products.service";
import { HttpErrors } from "../errors/httpErrors";

export class favoritesController {
    public static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
          const favorites = await FavoriteService.findAll();
          res.json(favorites);
        } catch (error) {
          next(error);
        }
      }

      public static async getUserFavorites(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const id = parseInt(res.locals.user.id);
          console.log(id)
          if (!id) throw new HttpErrors.NotFound("User not found");
          const products = await FavoriteService.getUserFavorites(id);
    
    
          // Return directly the favoriteProducts
          res.json(products);
        } catch (error) {
          next(error);
        }
      }

      public static async isFavorite(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const userId = parseInt(res.locals.user.id);
        if (!userId) throw new HttpErrors.BadRequest('userId required'); 
    
        const productId = parseInt(req.params.id);
        if (!productId) throw new HttpErrors.BadRequest('productId required'); 
    
        try {
          const isFavorite = await FavoriteService.isFavorite(userId, productId);
    
          res.json({ isFavorite });
        } catch (error) {
          next(error);
        }
      }

      public static async create(req: Request, res: Response, next: NextFunction) {
        try {
          const userId = parseInt(res.locals.user.id);
          const productId = parseInt(req.params.id);
          const user = await UserService.findOne(userId);
          if (!user) throw new HttpErrors.NotFound("User not found");
    
          const product = await ProductService.findOne(productId);
          if (!product) throw new HttpErrors.NotFound("Product not found");
    
          const data: CreateFavoriteCommand = {
            user,
            product,
          };
    
          const createdfavorite = await FavoriteService.create(data);
    
          res.json(createdfavorite);
        } catch (error) {
          next(error);
        }
      }

      public static async delete(req: Request, res: Response, next: NextFunction) {
        const userId = parseInt(res.locals.user.id);
        const productId = parseInt(req.params.id);
    
        try {
          const deletedfavorite = await FavoriteService.delete(userId, productId);
          res.json(deletedfavorite);
        } catch (error) {
          next(error);
        }
      }
    
}