import { ThemeProvider } from "@/components/provider/theme-provider";
import { ThemeColorSync } from "@/components/theme/theme-color-sync";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponentRoute,
});

function RootComponentRoute() {
  return (
    <ThemeProvider>
      <ThemeColorSync />
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
