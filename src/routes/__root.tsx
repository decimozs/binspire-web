import QueryProvider from "@/components/provider/query-provider";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ThemeColorSync } from "@/components/theme/theme-color-sync";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { MqttProvider } from "@/components/provider/mqtt-provider";
import { WebSocketProvider } from "@/components/provider/websocket-provider";

export const Route = createRootRoute({
  component: RootComponentRoute,
});

function RootComponentRoute() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Toaster position="top-center" />
        <ThemeColorSync />
        <NuqsAdapter>
          <MqttProvider>
            <WebSocketProvider>
              <Outlet />
            </WebSocketProvider>
          </MqttProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </QueryProvider>
  );
}
