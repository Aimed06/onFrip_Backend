import { Notification } from "../../../api/entities/Notification.entity";
import { UserService } from "../../../api/services/users.service";
import io from "../Handlers/server";

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
            const agentsSocketIds = await AgentService.getProductAgentsSocketIds(notification.productId);
            if (!agentsSocketIds || agentsSocketIds.length === 0) return;
            io.to(agentsSocketIds).emit("agent-notification:new", notification);
            console.log(`[SOCKET] Notification ${notification.id} sent to product #${notification.productId} agents (${agentsSocketIds.length} agents)`);
        }
    }
}

export default NotificationsEmitter;