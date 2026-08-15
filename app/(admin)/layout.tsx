"use client";

import { AppSidebar } from "@/components/organisms/app-sidebar";
import "../globals.css";
import type React from "react";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageNavigator } from "@/components/organisms/app-navigator";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/portal");
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex items-center justify-center font-cozy">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-[#f97316] border-[#f97316]/20 rounded-full animate-spin" />
          <p className="text-xs text-[#94a3b8]">Carregando Painel Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex bg-[#121214] min-h-screen">
      <SidebarProvider>
        <div className="w-fit">
          <AppSidebar />
        </div>
        <main className="min-h-screen w-full h-screen overflow-y-auto cozy-scroll">
          <PageNavigator />
          {children}
        </main>
      </SidebarProvider>
    </section>
  );
}
