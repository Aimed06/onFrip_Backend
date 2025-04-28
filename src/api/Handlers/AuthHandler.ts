import { Server, Socket } from "socket.io";
import { JwtService } from "../../config/jwt";
import { UserService } from "../../api/services/users.service";

const registerAuthHandlers = (io: Server, socket: Socket) => {

    socket.on("set-socket-id", async (data: any) => {
        try {
            const token: string = data.token;
            const userId = JwtService.verifyAuthToken(token);
            if (!userId) return;
            await UserService.setSocketId(userId, socket.id);
            console.log(`[SOCKET] User #${userId} connected : `, socket.id);
        } catch (error) {
            console.error(error);
        }
    });


    socket.on("get-online-users", async () => {
        // console.log(onlineUsers);
    });

    socket.on("disconnect", async () => {
        const user = await UserService.unsetSocketId(socket.id);
        if (user) console.log(`[SOCKET] User #${user.id} disconnected : `, socket.id);
    });
};

export default registerAuthHandlers