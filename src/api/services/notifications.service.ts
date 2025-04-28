import { Notification } from "../entities/Notification.entity";
import { CreateNotificationCommand } from "./commands/notifications/CreateNotificationCommand";
import { NotificationType } from "../entities/Notification.entity";

export class NotificationService {

  public static async findAll(): Promise<Notification[]> {
    const notifs = await Notification.find();
    return notifs;
  }

  public static async findOne(id: number): Promise<Notification | null> {
    const notifs = await Notification.findOneBy({ id });
    return notifs;
  }

  public static async create(notifsData: CreateNotificationCommand): Promise<Notification | null> {
    if (!notifsData.type) throw new Error("Notification type is required");
    if (!notifsData.userId && !notifsData.productId) throw new Error("User ID or Hotel ID is required");

    const notification = new Notification();
    if (notifsData.userId) notification.userId = notifsData.userId;
    if (notifsData.productId) notification.productId = notifsData.productId;
    notification.type = notifsData.type as NotificationType;
    notification.data = notifsData.data;
    notification.isSeen = false;
    notification.createdAt = notifsData.createdAt || new Date();

    try {
      const createdNotification = await notification.save();
      return createdNotification;
    } catch (error) {
      console.error("Error occurred while creating notification:", error);
      return null;
    }
  }

  public static async getUserNotification(userId: number): Promise<{ notifications: Notification[], unReadNotifications: number }> {
    const notifications = await Notification.find({
      where: { userId }, order: {
        id: 'DESC',
      }
    });
    const unReadNotifications = notifications.filter((n) => !n.isSeen).length;
    return { notifications, unReadNotifications };
  }

  public static async getProductNotification(productId: number): Promise<{ notifications: Notification[], unReadNotifications: number }> {
    const notifications = await Notification.find({
      where: { productId },
      order: {
        id: 'DESC',
      }
    });
    const unReadNotifications = notifications.filter((n) => !n.isSeen).length;
    return { notifications, unReadNotifications };
  }

  public static async markAsSeen(notificationId: number): Promise<void> {
    const notification = await Notification.findOne({ where: { id: notificationId } });
    if (!notification) throw new Error("Notification not found");

    notification.isSeen = true;
    notification.seenAt = new Date();
    await notification.save();
  }

  public static async delete(id: number) {
    const deletedNotification = await Notification.delete({ id });
    return deletedNotification;
  }
}
