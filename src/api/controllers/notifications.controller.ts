import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notifications.service";
import { CreateNotificationCommand } from "../services/commands/notifications/CreateNotificationCommand";
import { HttpErrors } from "../errors/httpErrors";
import { Notification } from "../entities/Notification.entity";

export class NotificationsController {

  public static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.user) throw new HttpErrors.Unauthorized("Unauthorized access");
      const userId = parseInt(res.locals.user?.id) || null;

      var notifications: Notification[] = [];
      var unReadNotifications = 0;
      if (userId) {
        let userNotification = await NotificationService.getUserNotification(userId);
        notifications = userNotification.notifications;
        unReadNotifications = userNotification.unReadNotifications;
      }

    

      res.json({
        success: true,
        notifications,
        unReadNotifications
      });

    } catch (error) {
      next(error);
    }
  }

  public static async findOne(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const notification = await NotificationService.findOne(id);
      if (!notification) throw new HttpErrors.NotFound("Notification not Found");
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, type, data, isSeen, createdAt } = req.body;
      if (!userId || !type || !data) throw new HttpErrors.BadRequest("Missing required fields: userId, type, data");

      const notificationData: CreateNotificationCommand = {
        userId,
        type,
        data,
        isSeen,
        createdAt,
      };

      const createdNotification = await NotificationService.create(notificationData);

      res.status(201).json(createdNotification);
    } catch (error) {
      next(error);
    }
  }

  public static async markAsSeen(req: Request, res: Response, next: NextFunction):Promise<void> {
    const notificationId = parseInt(req.params.id);
    try {
      if (!notificationId) res.status(400).json({ error: "Notification ID is required" });
      await NotificationService.markAsSeen(notificationId);
      res.status(200).json({ message: "Notification marked as seen" });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedNotification = await NotificationService.delete(id);
      res.json(`Notification with id ${id} deleted`);
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationsController;
