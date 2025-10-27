import { Server } from "http";
import { socketIO } from "@/lib/socket";

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  const httpServer: Server = res.socket.server as any;
  const io = socketIO(httpServer);
  
  res.socket.server.io = io;
  
  console.log("Socket is initialized");
  res.end();
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default SocketHandler;