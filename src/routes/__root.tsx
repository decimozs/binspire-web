import QueryProvider from "@/components/provider/query-provider";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ThemeColorSync } from "@/components/theme/theme-color-sync";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponentRoute,
});

function RootComponentRoute() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <ThemeColorSync />
      <QueryProvider>
        <Outlet />
      </QueryProvider>
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
