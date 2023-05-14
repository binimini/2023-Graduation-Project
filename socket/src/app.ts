import dotenv from "dotenv";
import Koa, {Context} from 'koa';
import * as process from "process";
import * as http from "http";
import {Server} from 'socket.io';
import handler from "./socket";

dotenv.config();

// node.js
const port = 8000;

const app = new Koa();
app.use((ctx: Context) => {
    ctx.body = process.env.OPENAI_API_KEY;
})
app.listen(port, () => {
    console.log(`listening to port ${port}`);
})

// socket.io
const server = http.createServer(app.callback());
const io = new Server(server, { cors: {origin: "*"}});

io.on("connection", handler);