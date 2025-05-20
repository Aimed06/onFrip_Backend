import { Order, orderStatus } from "../entities/Order.entity";
import { Product, ProductStatus } from "../entities/Product.entity";
import { User } from "../entities/User.entity";
import { CreateOrderCommand } from "./commands/orders/CreateOrder";
import { UpdateOrderCommand } from "./commands/orders/UpdateOrderCommand";
import { HttpErrors } from "../errors/httpErrors";

export class OrderService {
  // Récupérer toutes les commandes
  public static async findAll(): Promise<Order[]> {
    return Order.find({
      relations: ["user", "products"]
    });
  }

  // Récupérer une commande
  public static async findOne(id: number): Promise<Order | null> {
    return Order.findOne({
      where: { id },
      relations: ["user", "products"]
    });
  }

  // Créer une commande
  public static async create(orderData: CreateOrderCommand, user: User): Promise<Order> {
    const order = new Order();
    order.price = orderData.price;
    order.isPaid = orderData.isPaid;
    order.status = orderData.status || orderStatus.WAITING;
    order.user = user;
    order.products = orderData.products;
    return order.save();
  }

  // Mettre à jour une commande
  public static async update(id: number, orderData: UpdateOrderCommand): Promise<Order | null> {
    const order = await Order.findOneBy({ id });
    if (!order) return null;

    if (orderData.price !== undefined) order.price = orderData.price;
    if (orderData.isPaid !== undefined) order.isPaid = orderData.isPaid;
    if (orderData.status !== undefined) order.status = orderData.status;
    if (orderData.products) order.products = orderData.products;

    return order.save();
  }

  // Supprimer une commande
  public static async delete(id: number) {
    return Order.delete({ id });
  }

  // Récupérer les commandes d’un utilisateur
  public static async findUserOrders(userId: number): Promise<Order[]> {
    return Order.find({
      where: { user: { id: userId } },
      relations: ["products"]
    });
  }

  // Marquer une commande comme payée
  public static async markAsPaid(id: number): Promise<Order | null> {
    const order = await Order.findOneBy({ id });
    if (!order) return null;

    order.isPaid = true;
    return order.save();
  }

  // Annuler une commande
  public static async cancelOrder(id: number): Promise<Order | null> {
    const order = await Order.createQueryBuilder("order")
      .where("order.id = :id", { id })
      .andWhere("order.status = :status", { status: String(orderStatus.WAITING) }) // Status enregistré en string enum
      .getOne();

    if (!order) return null;

    order.status = orderStatus.CANCELED;
    return order.save();
  }

  // Obtenir les commandes d’un vendeur
  public static async getSellerOrders(sellerId: number): Promise<Order[]> {
    return Order.find({
      where: { products: { seller: { id: sellerId } } },
      relations: ["products", "products.seller", "user"]
    });
  }

  // Obtenir les statistiques de vente d’un vendeur
  public static async getSellerSalesStats(sellerId: number): Promise<{ totalSales: number }> {
    const totalSales = await Order.createQueryBuilder("order")
      .innerJoin("order.products", "product")
      .where("product.seller_id = :sellerId", { sellerId })
      .andWhere("order.status = :status", { status: orderStatus.CONFIRMED })
      .getCount();

    return { totalSales };
  }

  // Mettre à jour le statut d'une commande (confirmer/refuser/annuler)
}
