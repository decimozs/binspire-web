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
import { useIsMobile } from "@/hooks/use-mobile";

export default function SidebarBreadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMobile = useIsMobile();

  const allSegments = pathname.split("/").filter(Boolean);
  let segments: string[] = [];

  const last = allSegments[allSegments.length - 1];
  const secondLast = allSegments[allSegments.length - 2];

  if (allSegments.length >= 2 && last === "management") {
    const combined = `${secondLast} management`;
    segments = isMobile
      ? [combined]
      : [...allSegments.slice(0, allSegments.length - 2), combined];
  } else {
    segments = isMobile ? allSegments.slice(-1) : allSegments;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg">
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          let label = segment
            .split(" ")
            .map((part) => capitalize(part.replace(/-/g, " ")))
            .join(" ");

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
