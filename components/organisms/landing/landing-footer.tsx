"use client";

import React from "react";
import Link from "next/link";
import { Library } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0c0c0e] border-t border-[#5c3a21] py-12 px-6 md:px-12 mt-12 text-center text-[#94a3b8] font-cozy">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-lg flex items-center justify-center border border-[#cd853f]/30">
            <Library className="w-4 h-4 text-[#f4ebd0]" />
          </div>
          <span className="font-bold text-[#f4ebd0] text-sm">Biblioteca da 5ª Avenida</span>
        </div>

        <div className="flex gap-6 text-xs font-semibold">
          <Link href="/blog" className="hover:text-[#f4ebd0] transition-colors">Blog</Link>
          <Link href="/login" className="hover:text-[#f4ebd0] transition-colors">Entrar no Portal</Link>
          <Link href="#wishlist" className="hover:text-[#f4ebd0] transition-colors">Cadastrar Wishlist</Link>
        </div>
      </div>
      <div className="text-[11px] mt-8 opacity-60">
        © 2026 Biblioteca da 5ª Avenida RPG. Feito com amor, café e cartas NFC.
      </div>
    </footer>
  );
}
