import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/serverConfig";
import roomHandler from "./Handler/roomHandler";

const app = express();

app.use(cors());

const server = http.createServer(app);
// This will create the express API as raw HTTP of node and on top of that we add the websocket?"

const io = new Server(server, {
    // This line creates a new Socket.IO server (io) and attaches it to your HTTP server (server)
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("user connected");
    roomHandler(socket); // pass the socket connect so that each user can create and join the romm
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
