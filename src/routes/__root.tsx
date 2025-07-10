import QueryProvider from "@/components/provider/query-provider";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ThemeColorSync } from "@/components/theme/theme-color-sync";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "maplibre-gl/dist/maplibre-gl.css";
import { MqttProvider } from "@/components/provider/mqtt-provider";

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
            <Outlet />
          </MqttProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </QueryProvider>
  );
}
