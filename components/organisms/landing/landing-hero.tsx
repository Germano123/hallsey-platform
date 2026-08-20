"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WishlistService } from "@/lib/services/wishlist.service";
import { CrowdfundingService, CrowdfundingMeta } from "@/lib/services/crowdfunding.service";
import { 
  Users, 
  Sparkles, 
  CreditCard, 
  Library, 
  CheckCircle 
} from "lucide-react";

export function LandingHero() {
  const wishlistService = new WishlistService();
  const crowdfundingService = new CrowdfundingService();

  const [wishlistCount, setWishlistCount] = useState<number>(1284);
  const [funding, setFunding] = useState<CrowdfundingMeta>({
    currentFunding: 42850,
    targetFunding: 50000,
    backerCount: 432,
    daysRemaining: 18
  });

  const fundingPercent = Math.round((funding.currentFunding / funding.targetFunding) * 100);

  useEffect(() => {
    wishlistService.getWishlist().then(list => {
      setWishlistCount(1284 + list.length);
    });
    crowdfundingService.getMeta().then(data => {
      setFunding(data);
    });
  }, []);

  return (
    <section className="relative pt-12 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 font-cozy">
      {/* Glow ambient background */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#10b981]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f97316]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col gap-6 relative z-10 text-left">
        <div className="inline-flex items-center gap-2 bg-[#8b5a2b]/20 border border-[#cd853f]/40 px-3.5 py-1.5 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
          <span className="text-[#fb923c] text-xs font-semibold">Lançamento de Financiamento Coletivo</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f4ebd0] leading-tight">
          Descubra os Mistérios da <br />
          <span className="bg-gradient-to-r from-[#fb923c] via-[#f4ebd0] to-[#34d399] bg-clip-text text-transparent">
            Biblioteca da 5ª Avenida
          </span>
        </h2>

        <p className="text-base md:text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
          Um RPG de mesa de fantasia urbana onde livros esquecidos são portais para universos em colapso. Pela primeira vez no Brasil, jogue com **Cartões NFC Físicos Colecionáveis** integrados diretamente à sua ficha digital e ao tabuleiro virtual!
        </p>

        {/* Crowdfunding Live Stats Block */}
        <div className="p-6 bg-[#1c1c22] border border-white/5 rounded-2xl shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-[#94a3b8] uppercase font-medium">Meta Apoiada</span>
              <div className="text-2xl font-bold text-[#f4ebd0]">
                R$ {funding.currentFunding.toLocaleString("pt-BR")} <span className="text-xs font-normal text-[#94a3b8]">de R$ {funding.targetFunding.toLocaleString("pt-BR")}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#94a3b8] uppercase font-medium">Progresso</span>
              <div className="text-2xl font-bold text-[#34d399]">{fundingPercent}%</div>
            </div>
          </div>

          {/* Target bar */}
          <div className="w-full h-3.5 bg-[#121214] rounded-full overflow-hidden border border-white/5 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#f97316] to-[#34d399] rounded-full transition-all duration-1000" 
              style={{ width: `${fundingPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
            <div>
              <div className="text-sm font-semibold text-[#f4ebd0]">{funding.backerCount}</div>
              <div className="text-[10px] text-[#94a3b8] uppercase">Apoiadores</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#f4ebd0]">{funding.daysRemaining} Dias</div>
              <div className="text-[10px] text-[#94a3b8] uppercase">Restantes</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#34d399] flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 inline" /> {wishlistCount}
              </div>
              <div className="text-[10px] text-[#94a3b8] uppercase">Na Wishlist</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a href="#wishlist" className="btn btn-primary text-center px-8 py-3 rounded-full text-sm font-bold bg-[#f97316] text-[#121214]">
            Garantir Meu Acesso (Wishlist)
          </a>
          <a href="#mecanica-nfc" className="btn btn-secondary text-center px-8 py-3 rounded-full text-sm font-bold border-2 border-[#10b981] text-[#34d399]">
            Conhecer Ficha NFC
          </a>
        </div>
      </div>

      {/* Hero visual: Immersive card visual deck */}
      <div className="flex-1 w-full flex justify-center relative z-10">
        <div className="relative w-80 h-[450px]">
          {/* Background glowing frame */}
          <div className="absolute inset-0 bg-[#8b5a2b]/20 rounded-[30px] border border-[#cd853f]/30 transform -rotate-3 scale-105 shadow-2xl" />
          <div className="absolute inset-0 bg-[#1c1c22] rounded-[30px] border border-white/10 p-6 flex flex-col justify-between shadow-2xl transform rotate-1 transition-transform hover:rotate-0 duration-500">
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#fb923c] font-bold tracking-widest uppercase">Tomo Oficial RPG</span>
              <span className="px-2 py-0.5 text-[9px] bg-red-950 text-red-400 border border-red-500/20 rounded-full">Físico + Digital</span>
            </div>

            {/* Mock Image Box */}
            <div className="w-full h-48 bg-[#121214] border border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {/* Simulated game art */}
              <Library className="w-16 h-16 text-[#cd853f] opacity-80 group-hover:scale-110 transition-transform duration-300 relative z-20" />
              <div className="text-xs text-[#94a3b8] absolute bottom-3 text-center w-full z-20 font-medium">Biblioteca Oculta da 5ª Avenida</div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-lg font-bold text-[#f4ebd0]">Livro de Regras Luxo</h3>
              <p className="text-xs text-[#94a3b8] leading-normal">
                Capa dura com detalhes em hot stamping dourado, mais de 300 páginas de cenários, monstros bibliófagos, regras e 5 cartões NFC iniciais inclusos.
              </p>
              <div className="flex items-center gap-1 text-xs text-[#34d399] font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Inclui Tabuleiro Virtual Integrado
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-[#94a3b8]">A partir de:</span>
              <span className="text-xl font-black text-[#fb923c]">R$ 189,90</span>
            </div>
          </div>
          
          {/* Decored small floating card representing NFC card */}
          <div className="absolute -bottom-6 -right-6 w-36 h-52 bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-500/40 rounded-xl shadow-2xl p-3 flex flex-col justify-between transform rotate-12 hover:rotate-6 duration-300 cursor-pointer">
            <div className="flex justify-between items-center">
              <span className="text-[8px] text-indigo-300 font-bold uppercase">NFC Deck</span>
              <Sparkles className="w-2.5 h-2.5 text-indigo-300" />
            </div>
            <div className="w-full h-20 bg-black/40 rounded-lg flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-[#f4ebd0]">Grimório Ébano</h4>
              <p className="text-[8px] text-[#94a3b8] mt-0.5">Aproxime para invocar</p>
            </div>
            <div className="text-[9px] text-[#34d399] text-right font-bold">Nível 3</div>
          </div>
        </div>
      </div>
    </section>
  );
}
