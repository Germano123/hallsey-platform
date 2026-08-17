"use client";

import React from "react";
import Link from "next/link";
import { CampaignManager } from "@/components/organisms/campaign-manager";
import { ArrowLeft, Compass } from "lucide-react";

export default function CampanhasPage() {
  return (
    <div className="space-y-6 font-cozy relative z-10 max-w-4xl mx-auto">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#f4ebd0]">Acervo de Campanhas</h2>
          <p className="text-cozy-sm text-[#94a3b8] mt-1">
            Lista de todas as mesas de RPG de mesa ativas vinculadas à sua conta.
          </p>
        </div>

        <Link 
          href="/portal" 
          className="inline-flex items-center gap-1.5 text-cozy-xs text-[#94a3b8] hover:text-[#f4ebd0] transition-colors bg-white/5 border border-white/10 rounded-full px-4 py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Portal
        </Link>
      </div>

      {/* Campaigns Manager without limit */}
      <CampaignManager />

    </div>
  );
}
