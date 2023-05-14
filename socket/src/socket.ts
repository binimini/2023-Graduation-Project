import {Server} from "socket.io";
// @ts-ignore
import {ask, init} from "./chat-gpt.ts";

interface Rooms {
    [key:string]: RoomInfo
}

interface RoomInfo {
    conversationId: string,
    parentMessageId: string
}


let rooms: Rooms = {};

const registerSocketHandlers = (io : Server) => {
    io.on("connection",  (socket)=> {
        console.log(`socket ${socket.id} connected.`);

        socket.on('join', async (room:string) => {
            socket.join(room);

            if (rooms[room] == undefined) {
                rooms[room] = await init();
            }
            console.log(`socket ${socket.id} joined room ${room}.`);
        });

        socket.on('question', async (room: string, text: string) => {
            if (rooms[room] == undefined) return;
            const handleProgress = (room:string, role:string, id:string, text:string) => {
                io.to(room).emit('progress', { role, id, text })
            };
            const response = await ask(room, rooms[room], text, handleProgress);
            rooms[room].parentMessageId = response.id;
        });

        socket.on('feedback', async (room: string, code: string) => {
            if (rooms[room] == undefined) return;
            const handleProgress = (room:string, role:string, id:string, text:string) => {
                io.to(room).emit('progress', { role, id, text })
            };
            const response = await ask(room, rooms[room], code, handleProgress);
            rooms[room].parentMessageId = response.id;
        });

        socket.on("disconnect", (reason) => {
            console.log(`socket ${socket.id} disconnected due to ${reason}`);
        });
    });
}

export {RoomInfo}
export default registerSocketHandlers;