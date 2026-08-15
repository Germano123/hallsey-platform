import { AppSidebar } from "@/components/organisms/app-sidebar";
import "../globals.css";
import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageNavigator } from "@/components/organisms/app-navigator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex">
      <SidebarProvider>
        <div className="w-fit">
            <AppSidebar />
        </div>
        <main className="min-w-screen min-h-screen w-full h-screen">
          <PageNavigator />
          {children}
        </main>
      </SidebarProvider>
    </section>
  );
}
