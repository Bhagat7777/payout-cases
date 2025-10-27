import { NextApiRequest, NextApiResponse } from "next";
import { Server as HTTPServer } from "http";
import { socketIO } from "@/lib/socket";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // In a real implementation, you would:
    // 1. Validate the request data
    // 2. Save to database
    // 3. Emit socket event
    
    const { type, ...data } = req.body;
    
    // Simulate processing delay
    setTimeout(() => {
      // Emit socket event if socket is available
      // @ts-ignore - Next.js internal server property
      if (res.socket?.server?.io) {
        // @ts-ignore - Next.js internal server property
        const io = res.socket.server.io;
        
        // Emit to all connected clients
        if (type === "approval") {
          io.emit("approvalUpdate", {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            type,
            status: "completed",
            timestamp: new Date().toISOString()
          });
        } else if (type === "denial") {
          io.emit("denialUpdate", {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            type,
            status: "pending",
            timestamp: new Date().toISOString()
          });
        }
      }
      
      res.status(200).json({ success: true, message: "Case submitted successfully" });
    }, 1000);
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Failed to submit case" });
  }
}

export const config = {
  api: {
    bodyParser: true
  }
};