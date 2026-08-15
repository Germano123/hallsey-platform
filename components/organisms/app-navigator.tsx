"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

export const PageNavigator = () => {
  const pathname = usePathname();

  const segments = pathname.split("?")[0].split("/").filter(Boolean);

  const isDashboardRoute = segments[0] === "dashboard";

  const breadcrumbs = [
    ...(!isDashboardRoute ? [{ label: "Dashboard", href: "/dashboard" }] : []),

    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return {
        label: decodeURIComponent(segment),
        href,
      };
    }),
  ];

  return (
    <div className="px-12 py-4">
      <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-2 shadow-md text-sm">
        <SidebarTrigger />

        <Separator orientation="vertical" className="mx-2 h-4" />

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <span key={crumb.href} className="flex items-center gap-2">
              {index !== 0 && <span className="text-slate-400">/</span>}

              {isLast ? (
                <span className="font-semibold text-slate-900 capitalize">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="capitalize text-slate-700 hover:text-emerald-600 hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
