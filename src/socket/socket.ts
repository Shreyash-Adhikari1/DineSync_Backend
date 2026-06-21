import { Server } from "socket.io";
import { CORS_ORIGINS } from "../config/env";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: CORS_ORIGINS,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("join-session", (sessionId: string) => {
      socket.join(sessionId);

      console.log(`${socket.id} joined session room ${sessionId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
