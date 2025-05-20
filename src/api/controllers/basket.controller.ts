import { NextFunction, Request, Response } from "express";
import { BasketService } from "../services/basket.service";
import { CreateBasketCommand } from "../services/commands/basket/CreateBasketCommand";
import { UserService } from "../services/users.service";
import { ProductService } from "../services/products.service";
import { HttpErrors } from "../errors/httpErrors";

export class basketsController {
  public static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const baskets = await BasketService.findAll();
      res.json(baskets);
    } catch (error) {
      next(error);
    }
  }

  public static async getUserBaskets(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(res.locals.user.id);
      console.log(id);
      if (!id) throw new HttpErrors.NotFound("User not found");
      const products = await BasketService.getUserBasket(id);

      // Return directly the basketProducts
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  public static async isBasket(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = parseInt(res.locals.user.id);
    if (!userId) throw new HttpErrors.BadRequest("userId required");

    const productId = parseInt(req.params.id);
    if (!productId) throw new HttpErrors.BadRequest("productId required");

    try {
      const isBasket = await BasketService.isBasket(userId, productId);

      res.json({ isBasket });
    } catch (error) {
      next(error);
    }
  }

  public static async  create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number.parseInt(res.locals.user.id)
    const productId = Number.parseInt(req.params.id)

    const user = await UserService.findOne(userId)
    if (!user) throw new HttpErrors.NotFound("User not found")

    // Check if the product is not owned by the user
    const isOwned = await ProductService.isProductOwned(userId, productId)
    if (isOwned) {
      throw new HttpErrors.BadRequest("You already own this product")
    }

    const product = await ProductService.findOne(productId)
    if (!product) throw new HttpErrors.NotFound("Product not found")

    const data: CreateBasketCommand = {
      user,
      product,
    }

    const createdbasket = await BasketService.create(data)

    res.json(createdbasket)
  } catch (error) {
    next(error)
  }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(res.locals.user.id);
    const productId = parseInt(req.params.id);

    try {
      const deletedbasket = await BasketService.delete(userId, productId);
      res.json(deletedbasket);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAll(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(res.locals.user.id);
    if (!userId) throw new HttpErrors.BadRequest("userId required");

    try {
      const deletedbasket = await BasketService.deleteAll(userId);
      res.json(deletedbasket);
    } catch (error) {
      next(error);
    }
  }
}
