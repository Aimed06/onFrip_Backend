// controllers/order.controller.ts
import { NextFunction } from "express";
import { OrderService } from "../services/orders.service";
import { HttpError, HttpErrors } from "../errors/httpErrors";
import { UserService } from "../services/users.service";
import { UserRole } from "../entities/User.entity";
import { ProductService } from "../services/products.service";
import { Order, orderStatus } from "../entities/Order.entity";
import { NetConnectOpts } from "net";
import { ProductStatus } from "../entities/Product.entity";

export class OrderController {
  public static async findAll(req: any, res: any, next: NextFunction) {
    try {
      const orders = await OrderService.findAll();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  public static async findOne(req: any, res: any, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const order = await OrderService.findOne(id);
      if (!order) throw new HttpErrors.NotFound(`Order with id ${id} not found`);
      
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: any, res: any, next: NextFunction) {
  try {
    const { isPaid, status, productIds } = req.body;
    const user = res.locals.user;
    
    if (!user) throw new HttpErrors.NotFound(`User not authenticated`);
    if (isPaid === undefined) throw new HttpErrors.BadRequest("isPaid status is required");
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) 
      throw new HttpErrors.BadRequest("Product IDs are required");

    // Récupérer les produits à partir des IDs
    const products = [];
    let totalPrice = 0;
    
    for (const productId of productIds) {
      const product = await ProductService.findOne(productId);
      if (!product) throw new HttpErrors.NotFound(`Product with id ${productId} not found`);
      
      // Ajouter le prix du produit au prix total
      totalPrice += Number(product.price);
      products.push(product);
    }

    const order = await OrderService.create({
      price: totalPrice, // Utiliser le prix total calculé
      isPaid,
      status: status || orderStatus.WAITING,
      products
    }, user);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

  public static async update(req: any, res: any, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const { price, isPaid, status, productIds } = req.body;
      const user = res.locals.user;
      
      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);

      // Vérifier si l'ordre existe et appartient à l'utilisateur ou si l'utilisateur est admin
      const existingOrder = await OrderService.findOne(id);
      if (!existingOrder) throw new HttpErrors.NotFound(`Order with id ${id} not found`);
      
    //   if (existingOrder.user_id !== user.id && user.role !== UserRole.ADMIN) {
    //     throw new HttpErrors.Forbidden("You don't have permission to update this order");
    //   }

      // Préparer les données de mise à jour
      const updateData: any = {};
      if (price !== undefined) updateData.price = price;
      if (isPaid !== undefined) updateData.isPaid = isPaid;
      if (status !== undefined) updateData.status = status;

      // Mettre à jour les produits si nécessaire
      if (productIds && Array.isArray(productIds) && productIds.length > 0) {
        const products = [];
        for (const productId of productIds) {
          const product = await ProductService.findOne(productId);
          if (!product) throw new HttpErrors.NotFound(`Product with id ${productId} not found`);
          products.push(product);
        }
        updateData.products = products;
      }

      const updatedOrder = await OrderService.update(id, updateData);
      if (!updatedOrder) throw new HttpErrors.NotFound(`Order with id ${id} not found`);
      
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }


  public static async delete(req: any, res: any, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const user = res.locals.user;
      
      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);

      // Vérifier si l'ordre existe et appartient à l'utilisateur ou si l'utilisateur est admin
      const existingOrder = await OrderService.findOne(id);
      if (!existingOrder) throw new HttpErrors.NotFound(`Order with id ${id} not found`);
      
     

      await OrderService.delete(id);
      res.json({ message: `Order with id ${id} deleted` });
    } catch (error) {
      next(error);
    }
  }

  // Récupérer les commandes d'un utilisateur
  public static async getUserOrders(req: any, res: any, next: NextFunction) {
    try {
      const user = res.locals.user;
      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);

      const orders = await OrderService.findUserOrders(user.id);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

   // Mettre à jour le statut d'une commande
  public static async updateOrderStatus(req: any, res: any, next: NextFunction) {
    try {
      const  id  = parseInt(req.params.id)
      const { status, reason } = req.body
      const user = res.locals.user

      if (!user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" })
      }

      // Valider le statut
      if (status === undefined || !Object.values(orderStatus).includes(status)) {
        return res.status(400).json({ message: "Statut de commande invalide" })
      }

      // Valider la raison pour le refus
      if (status === orderStatus.REFUSED && (!reason || reason.trim() === "")) {
        return res.status(400).json({ message: "Une raison est requise pour refuser une commande" })
      }

      const order = await Order.findOne({
        where: { id: Number(id) },
        relations: ["products", "products.seller", "user"],
      })

      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" })
      }

      // Vérifier que l'utilisateur est le propriétaire de la commande ou le vendeur d'un des produits
      const isOwner = order.user_id === user.id
      const isSeller = order.products.some((product) => product.seller?.id === user.id)

      if (!isOwner && !isSeller) {
        return res.status(403).json({ message: "Accès non autorisé à cette commande" })
      }

      // Vérifier les permissions selon le statut
      if (status === orderStatus.CONFIRMED || status === orderStatus.REFUSED) {
        // Seul le vendeur peut confirmer ou refuser
        if (!isSeller) {
          return res.status(403).json({ message: "Seul le vendeur peut confirmer ou refuser une commande" })
        }
      } else if (status === orderStatus.CANCELED) {
        // Seul le client peut annuler
        if (!isOwner) {
          return res.status(403).json({ message: "Seul le client peut annuler une commande" })
        }
        // Vérifier que la commande n'est pas déjà confirmée
        if (order.status === orderStatus.CONFIRMED) {
          return res.status(400).json({ message: "Impossible d'annuler une commande déjà confirmée" })
        }
      }
      console.log("Statut de la commande:", status);
          // ✅ Si commande confirmée, marquer tous les produits comme vendus
          if (status === orderStatus.CONFIRMED) {
            for (const product of order.products) {
              product.status = ProductStatus.SOLD;
              console.log("Statut de la commande après confirmation:",  product.status);
              await product.save();
            }
          }

      // Mettre à jour le statut
      order.status = status
      await order.save()

      // Récupérer la commande mise à jour avec toutes les relations
      const updatedOrder = await Order.findOne({
        where: { id: Number(id) },
        relations: ["products", "products.seller", "products.category", "user"],
      })

      return res.json(updatedOrder)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande:", error)
      return res.status(500).json({ message: "Erreur serveur" })
    }
  }
  // Marquer une commande comme payée
  public static async markOrderAsPaid(req: any, res: any, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const user = res.locals.user;
      
      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);
     

      const updatedOrder = await OrderService.markAsPaid(id);
      if (!updatedOrder) throw new HttpErrors.NotFound(`Order with id ${id} not found`);
      
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques de vente pour un vendeur
  public static async getSellerSalesStats(req: any, res: any, next: NextFunction) {
    try {
      const user = res.locals.user;
      
      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);
      if (user.role !== UserRole.VENDOR) {
        throw new HttpErrors.Forbidden("Only vendors can access sales statistics");
      }

      const { totalSales } = await OrderService.getSellerSalesStats(user.id);
      res.json({ totalSales });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les commandes d'un vendeur
  public static async getSellerOrders(req: any, res: any, next: NextFunction) {
    try {
      const user = res.locals.user;

      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);
      if (user.role !== UserRole.VENDOR) {
        throw new HttpErrors.Forbidden("Only vendors can access their orders");
      }
      // Vérifier si le vendeur existe
      const existingSeller = await UserService.findOne(user.id);
      console.log("Existing seller:", existingSeller);

      const orders = await OrderService.getSellerOrders(user.id);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
  // annuler une commande
  public static async cancelOrder(req: any, res: any, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const user = res.locals.user;
      
      if (!user) throw new HttpErrors.NotFound(`User not authenticated`);
      

      const canceledOrder = await OrderService.cancelOrder(id);
      if (!canceledOrder) throw new HttpErrors.NotFound(`Order with id ${id} not found`);
      
      res.json(canceledOrder);
    } catch (error) {
      next(error);
    }
  }
}