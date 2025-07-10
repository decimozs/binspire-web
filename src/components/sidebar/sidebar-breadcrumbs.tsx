import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Link, useRouterState } from "@tanstack/react-router";
import { capitalize } from "@/lib/utils";
import React from "react";

export default function SidebarBreadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          let label = capitalize(segment.replace(/-/g, " "));

          if (
            isLast &&
            (segment === "admin-board" || segment === "collector-board")
          ) {
            label = "Board";
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium capitalize">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
