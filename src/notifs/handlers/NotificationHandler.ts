import { Server, Socket } from "socket.io";
import { NotificationService } from "../../api/services/notifications.service";

const NotificationsHandler = (io: Server, socket: Socket) => {

    // Notification:seen event
    socket.on("notification:seen", async (data: any) => {
        const { notificationId } = data;
        if (!notificationId) return;
        await NotificationService.markAsSeen(notificationId);
        console.log(`[SOCKET] Notification ${notificationId} marked as seen`);
    });

}

export default NotificationsHandler;