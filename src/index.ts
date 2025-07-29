import cors from "cors";
import express from "express";
import http from "http";
import { ExpressPeerServer } from "peer"; // ✅ ADD THIS
import { Server } from "socket.io";
import { PORT } from "./config/serverConfig";
import roomHandler from "./Handler/roomHandler";

const app = express();
app.use(cors());

const server = http.createServer(app);

//  ADD PEERJS SERVER SETUP HERE
const peerServer = ExpressPeerServer(server, {
  path: "/myapp",
});
app.use("/peerjs", peerServer); // Serve PeerJS at /peerjs/myapp

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// START SERVER
server.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
