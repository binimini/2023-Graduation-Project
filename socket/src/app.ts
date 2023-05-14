import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import * as http from "http";
import {Server} from 'socket.io';
// @ts-ignore
import registerSocketHandlers from "./socket.ts";

dotenv.config();

// node.js
const port = 8000;

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true}));

// socket.io
const server = http.createServer(app);

const io = new Server(server, { cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

registerSocketHandlers(io);

server.listen(port, () => {
    console.log(`listening to port ${port}`);
})

