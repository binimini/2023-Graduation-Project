import {Server} from "socket.io";
// @ts-ignore
import {ask, feedback, init} from "./chat-gpt.ts";

interface Rooms {
    [key:string]: RoomInfo
}

interface RoomInfo {
    conversationId?: string,
    parentMessageId?: string,
    isUsing: boolean
}


let rooms: Rooms = {};

const registerSocketHandlers = (io : Server) => {
    io.on("connection",  (socket)=> {
        console.log(`socket ${socket.id} connected.`);

        socket.on('join', async (room:string) => {
            socket.join(room);

            if (rooms[room] == undefined || rooms[room].conversationId == undefined) {
                rooms[room] = {
                    isUsing: true
                }
                try {
                    rooms[room] = { isUsing: rooms[room].isUsing, ...await init()};
                }
                catch (e) {
                    io.to(room).emit('error');
                }
                rooms[room].isUsing = false;
            }
            console.log(`socket ${socket.id} joined room ${room}.`);
            io.emit('join');
        });

        socket.on('question', async (room: string, text: string) => {
            if (rooms[room] == undefined || rooms[room].isUsing) return;
            rooms[room].isUsing = true;
            io.to(room).emit('question');
            const handleProgress = (room:string, role:string, id:string, text:string) => {
                io.to(room).emit('progress', { role, id, text })
            };
            try {
                const response = await ask(room, rooms[room], text, handleProgress);
                rooms[room].parentMessageId = response.id;
            }
            catch (e) {
                io.to(room).emit('error');
            }
            rooms[room].isUsing = false;
            io.to(room).emit('answer');
        });

        socket.on('feedback', async (room: string, code: string) => {
            if (rooms[room] == undefined || rooms[room].isUsing) return;
            rooms[room].isUsing = true;
            io.to(room).emit('feedback');
            const handleProgress = (room:string, role:string, id:string, text:string) => {
                io.to(room).emit('progress', { role, id, text })
            };
            try {
                const response = await feedback(room, rooms[room], code, handleProgress);
                rooms[room].parentMessageId = response.id;
            }
            catch (e) {
                io.to(room).emit('error');
            }
            rooms[room].isUsing = false;
            io.to(room).emit('answer');
        });

        socket.on("disconnect", (reason) => {
            console.log(`socket ${socket.id} disconnected due to ${reason}`);
        });
    });
}

export {RoomInfo}
export default registerSocketHandlers;