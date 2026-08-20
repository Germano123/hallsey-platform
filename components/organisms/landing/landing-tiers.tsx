"use client";

import React from "react";
import Link from "next/link";

export function LandingTiers() {
  return (
    <section id="tiers" className="py-20 px-6 md:px-12 max-w-7xl mx-auto font-cozy">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 bg-[#fb923c]/10 border border-[#fb923c]/30 px-3 py-1 rounded-full text-xs text-[#fb923c] font-medium uppercase tracking-wider">
          Recompensas da Campanha
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#f4ebd0]">Escolha sua Categoria de Apoio</h2>
        <p className="text-[#94a3b8] max-w-xl mx-auto text-sm md:text-base">
          Temos opções digitais ideais para grupos de distância e opções físicas de alta qualidade com os cartões NFC para uma mesa imersiva presencial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Tier 1 */}
        <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-8 shadow-xl flex flex-col justify-between gap-6 hover:border-[#8b5a2b]/40 hover:-translate-y-1 transition-all">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#34d399] font-bold uppercase tracking-wider">Apoio Básico (Digital)</span>
              <h3 className="text-2xl font-bold text-[#f4ebd0] mt-1">Iniciado Digital</h3>
            </div>
            <div className="text-3xl font-extrabold text-[#fb923c]">R$ 49,90</div>
            <p className="text-xs text-[#94a3b8] leading-normal">
              Ideal para jogadores solos e mestres que utilizam plataformas de mesa virtual (VTT) online.
            </p>
            <ul className="text-xs text-[#f4ebd0] space-y-2 pt-2">
              <li className="flex items-center gap-2">✓ Livro de Regras PDF Completo</li>
              <li className="flex items-center gap-2">✓ Mapa Digital da Biblioteca</li>
              <li className="flex items-center gap-2">✓ Tokens Virtuais para Roll20/Foundry</li>
              <li className="flex items-center gap-2">✓ Acesso ao Portal do Usuário (Básico)</li>
            </ul>
          </div>
          <Link href="#wishlist" className="w-full text-center py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-semibold block border border-white/10 transition-colors">
            Apoiar Categoria
          </Link>
        </div>

        {/* Tier 2 (Highlighted) */}
        <div className="bg-[#1c1c22] border-2 border-[#f97316] rounded-[20px] p-8 shadow-2xl flex flex-col justify-between gap-6 hover:-translate-y-1 transition-all relative">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#f97316] text-[#121214] text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
            Mais Recomendado
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#fb923c] font-bold uppercase tracking-wider">Apoio Premium (Físico)</span>
              <h3 className="text-2xl font-bold text-[#f4ebd0] mt-1">Guardião dos Tomos</h3>
            </div>
            <div className="text-3xl font-extrabold text-[#fb923c]">R$ 189,90</div>
            <p className="text-xs text-[#94a3b8] leading-normal">
              A experiência ideal para sua mesa! Acompanha o livro físico e o baralho NFC básico para iniciar a aventura de forma tátil.
            </p>
            <ul className="text-xs text-[#f4ebd0] space-y-2 pt-2">
              <li className="flex items-center gap-2 text-[#34d399] font-medium">✓ Livro Físico Luxo Capa Dura</li>
              <li className="flex items-center gap-2">✓ 5 Cartões NFC Iniciais (Físicos)</li>
              <li className="flex items-center gap-2">✓ PDF e Extras Digitais inclusos</li>
              <li className="flex items-center gap-2">✓ Escudo do Mestre em papel rígido</li>
            </ul>
          </div>
          <Link href="#wishlist" className="w-full text-center py-2.5 bg-[#f97316] hover:bg-[#fb923c] text-[#121214] rounded-full text-xs font-bold block shadow-lg shadow-[#f97316]/20 transition-all">
            Apoiar Categoria
          </Link>
        </div>

        {/* Tier 3 */}
        <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-8 shadow-xl flex flex-col justify-between gap-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Apoio Deluxe (Colecionador)</span>
              <h3 className="text-2xl font-bold text-[#f4ebd0] mt-1">Bibliotecário Supremo</h3>
            </div>
            <div className="text-3xl font-extrabold text-[#fb923c]">R$ 349,90</div>
            <p className="text-xs text-[#94a3b8] leading-normal">
              Para colecionadores e mestres dedicados. Inclui tomos personalizados e o baralho completo de cartões NFC com caixa de madeira.
            </p>
            <ul className="text-xs text-[#f4ebd0] space-y-2 pt-2">
              <li className="flex items-center gap-2">✓ Livro Físico Luxo Autografado</li>
              <li className="flex items-center gap-2 text-purple-300 font-medium">✓ Deck de 15 Cartões NFC (Gravação em Madeira/Metal)</li>
              <li className="flex items-center gap-2">✓ Miniatura 3D do Bibliófago Sombrio</li>
              <li className="flex items-center gap-2">✓ Caixa de Tomo de Madeira personalizada</li>
            </ul>
          </div>
          <Link href="#wishlist" className="w-full text-center py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-semibold block border border-white/10 transition-colors">
            Apoiar Categoria
          </Link>
        </div>

      </div>
    </section>
  );
}
