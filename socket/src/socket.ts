import {Socket} from "socket.io";

const handler = (socket : Socket) => {
    console.log(`socket ${socket.id} connected`);

    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
}

export default handler;
