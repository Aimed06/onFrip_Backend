import { instrument } from "@socket.io/admin-ui";
import { Server, Socket } from "socket.io";

import registerAuthHandlers from "./handlers/AuthHandler";
import notificationsHandler from "./handlers/NotificationHandler";

var origins = ["https://admin.socket.io"];
if (process.env.ORIGIN) origins.push(process.env.ORIGIN);
console.log("[ORIGINS]", origins);

const io = new Server({
  cors: {
    origin: origins,
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("[SOCKET] New connection", socket.id);
  notificationsHandler(io, socket);
  registerAuthHandlers(io, socket);
});

instrument(io, {
  auth: false,
});

export default io;
