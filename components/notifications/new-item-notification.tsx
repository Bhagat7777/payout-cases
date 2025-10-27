"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { CheckCircle, XCircle } from "lucide-react";

export function NewItemNotification() {
  const [notifications, setNotifications] = useState<Array<{id: string, type: string, message: string}>>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleApproval = (data: any) => {
      const newNotification = {
        id: Math.random().toString(36).substr(2, 9),
        type: "approval",
        message: `New approval from ${data.traderName} at ${data.propFirm}`
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    };

    const handleDenial = (data: any) => {
      const newNotification = {
        id: Math.random().toString(36).substr(2, 9),
        type: "denial",
        message: `New denial from ${data.traderName} at ${data.propFirm}`
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    };

    socket.on("approvalUpdate", handleApproval);
    socket.on("denialUpdate", handleDenial);

    return () => {
      socket.off("approvalUpdate", handleApproval);
      socket.off("denialUpdate", handleDenial);
    };
  }, [socket]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              notification.type === "approval" 
                ? "bg-green-500/90 text-white" 
                : "bg-red-500/90 text-white"
            }`}
          >
            {notification.type === "approval" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}