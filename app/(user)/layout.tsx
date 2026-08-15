"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { RightUserPanel } from "@/components/organisms/right-user-panel";
import { Library, LogOut } from "lucide-react";
import "../globals.css";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex items-center justify-center font-cozy">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-[#10b981] border-[#10b981]/20 rounded-full animate-spin" />
          <p className="text-xs text-[#94a3b8]">Carregando Ficha do Guardião...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col font-cozy">
      
      {/* Dynamic Top bar */}
      <header className="bg-[#121214] border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-xl flex items-center justify-center border border-[#cd853f]/30">
            <Library className="w-4 h-4 text-[#f4ebd0]" />
          </Link>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#f4ebd0] leading-none">5ª Avenida RPG</h1>
            <span className="text-[9px] text-[#34d399] tracking-wider uppercase font-semibold">Portal do Guardião</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/dashboard" className="text-xs bg-[#f97316] text-[#121214] font-bold px-4 py-1.5 rounded-full hover:bg-[#fb923c] transition-colors">
              Ir para Painel Admin
            </Link>
          )}
          
          <button 
            onClick={logout} 
            className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f4ebd0] transition-colors bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main page content area */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch overflow-hidden relative z-10">
        
        {/* Workspace (left side) */}
        <main className="flex-1 overflow-y-auto cozy-scroll p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Right Navigation Panel (20vw minimum width on large screens) */}
        <div className="border-t border-white/5 lg:border-t-0 lg:border-l lg:border-white/5 p-4 bg-[#0c0c0e]/40 shrink-0">
          <RightUserPanel />
        </div>

      </div>
    </div>
  );
}
