import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export const socketIO = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for new approval submissions
    socket.on("newApproval", (data) => {
      console.log("New approval received:", data);
      // Broadcast to all clients
      io.emit("approvalUpdate", data);
    });

    // Listen for new denial submissions
    socket.on("newDenial", (data) => {
      console.log("New denial received:", data);
      // Broadcast to all clients
      io.emit("denialUpdate", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};