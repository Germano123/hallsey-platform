"use client";

import React from "react";
import Link from "next/link";
import { Library } from "lucide-react";
import { User } from "@/lib/interfaces/auth.interface";

interface LandingHeaderProps {
  user: User | null;
}

export function LandingHeader({ user }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#121214]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all font-cozy">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-xl flex items-center justify-center border border-[#cd853f]/30">
          <Library className="w-5 h-5 text-[#f4ebd0]" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#f4ebd0] leading-none">Biblioteca da 5ª Avenida</h1>
          <span className="text-[10px] text-[#34d399] tracking-wider uppercase font-medium">RPG Crowdfunding</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#narrativa" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">A História</a>
        <a href="#mecanica-nfc" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">Cartões NFC</a>
        <a href="#wishlist" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">Wishlist</a>
        <a href="#tiers" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">Recompensas</a>
        <Link href="/blog" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors flex items-center gap-1">
          Blog <span className="px-1.5 py-0.5 text-[9px] bg-[#fb923c]/20 text-[#fb923c] rounded-full">Novidades</span>
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <Link href="/portal" className="px-5 py-2 rounded-full border-2 border-[#10b981] text-[#34d399] hover:bg-[#10b981]/10 text-xs font-semibold transition-all">
            Acessar Portal ({user.name?.split(" ")[0]})
          </Link>
        ) : (
          <Link href="/login" className="px-5 py-2 rounded-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] text-xs font-semibold transition-all shadow-md shadow-[#f97316]/20">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
