import { Notification } from "../../api/entities/Notification.entity";
import { ProductService } from "../../api/services/products.service";
import { UserService } from "../../api/services/users.service";
import io from "../server";

export class NotificationsEmitter {

    static sendNotification = async (notification: Notification) => {
        if (!notification.userId && !notification.productId) return;

        if (notification.userId) {
            const user = await UserService.findOne(notification.userId);
            if (!user) return;
            if (!user.socketId) return;
            io.to(user.socketId).emit("notification:new", notification);
            console.log(`[SOCKET] Notification ${notification.id} sent to user #${user.id} : ${user.socketId}`);
        }

        if (notification.productId) {
            const userSocketId = await UserService.getProductUserSocketId(notification.productId);
            if (!userSocketId) return;
            io.to(userSocketId).emit("agent-notification:new", notification);
            console.log(`[SOCKET] Notification ${notification.id} sent to product #${notification.productId} user: ${userSocketId}`);
        }
    }
}

export default NotificationsEmitter;