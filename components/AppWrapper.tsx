"use client";

import * as React from "react";
import { SocketProvider } from "@/components/providers/socket-provider";
import { NewItemNotification } from "@/components/notifications/new-item-notification";
import { ClientMount } from "@/components/ClientMount";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientMount>
      <SocketProvider>
        {children}
        <NewItemNotification />
      </SocketProvider>
    </ClientMount>
  );
}