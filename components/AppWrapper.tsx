"use client";

import * as React from "react";
import { SocketProvider } from "@/components/providers/socket-provider";
import { NewItemNotification } from "@/components/notifications/new-item-notification";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      {children}
      <NewItemNotification />
    </SocketProvider>
  );
}