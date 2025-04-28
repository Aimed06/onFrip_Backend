import { Server, Socket } from "socket.io";

const registerOrderHandlers = (io: Server, socket: Socket) => {

    const OrderAccepted = (data: any) => {
        const receptionis = socket.id
        console.log(`User ${receptionis} accepted order ${data.orderId}`);
    }

    const OrderRejected = (data: any) => {
        const receptionis = socket.id
        console.log(`User ${receptionis} rejected order ${data.orderId}`);
    }

    socket.on("order:accepted", OrderAccepted);
    socket.on("order:rejected", OrderRejected);
}

export default registerOrderHandlers;