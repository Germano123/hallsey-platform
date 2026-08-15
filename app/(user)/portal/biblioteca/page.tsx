"use client";

import React, { useState } from "react";
import { BookOpen, Lock, ShieldCheck, FileText, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Tomo {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
  chapters: { title: string; content: string }[];
}

export default function BibliotecaPage() {
  const [selectedTomo, setSelectedTomo] = useState<Tomo | null>(null);
  const [readingChapter, setReadingChapter] = useState<{ title: string; content: string } | null>(null);

  const tomos: Tomo[] = [
    {
      id: "t-1",
      name: "Tomo I: O Livro das Horas Perdidas",
      desc: "O livro de regras oficial contendo a cosmologia da Biblioteca, a ficha de ameaças e o guia de criação de personagens.",
      unlocked: true,
      chapters: [
        {
          title: "Capítulo 1: O Silêncio da 5ª Avenida",
          content: "A Biblioteca da 5ª Avenida foi erguida em 1911, não para catalogar livros humanos, mas para isolar portais cósmicos. Cada obra literária escrita com intenção genuína abre um Texto-Mundo. Os Guardiões foram designados para cruzar as estantes e impedir que essas realidades vazem para o plano físico..."
        },
        {
          title: "Capítulo 2: Os Bibliófagos",
          content: "Bibliófagos Sombrios são parasitas formados de poeira e silêncio. Eles devoram letras nos tomos originais. Uma única frase devorada pode apagar uma dinastia inteira ou alterar as propriedades de um feitiço de cura. Eles devem ser combatidos usando chaves físicas e focos místicos..."
        }
      ]
    },
    {
      id: "t-2",
      name: "Tomo II: A Sombra da Estante",
      desc: "Guia de campanha expandido contendo novos monstros bibliófagos do Setor Sombrio e baralhos NFC adicionais.",
      unlocked: false,
      chapters: []
    }
  ];

  return (
    <div className="space-y-8 font-cozy relative z-10 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#f4ebd0]">Biblioteca de Tomos</h2>
        <p className="text-xs text-[#94a3b8] mt-1">Acesse os livros, guias de monstros e cenários desbloqueados por seu apoio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left: Tomos List */}
        <div className="md:col-span-1 space-y-4">
          <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider block">Acervo Disponível</span>
          
          {tomos.map(tomo => (
            <Card 
              key={tomo.id}
              onClick={() => {
                if (tomo.unlocked) {
                  setSelectedTomo(tomo);
                  setReadingChapter(tomo.chapters[0] || null);
                }
              }}
              className={`p-4 rounded-xl border flex flex-col justify-between h-40 cursor-pointer transition-all shadow-md ${
                tomo.unlocked 
                  ? selectedTomo?.id === tomo.id
                    ? "bg-gradient-to-br from-[#1c1c22] to-white/5 border-[#10b981]/40 ring-1 ring-[#10b981]"
                    : "bg-[#1c1c22] border-white/5 hover:border-white/10"
                  : "bg-[#1c1c22]/40 border-white/5 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-[#fb923c]">Tomo Oficinal</span>
                  {tomo.unlocked ? (
                    <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#94a3b8]" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#f4ebd0]">{tomo.name}</h4>
                <p className="text-[10px] text-[#94a3b8] line-clamp-3 leading-normal">{tomo.desc}</p>
              </div>

              {tomo.unlocked ? (
                <div className="text-[9px] text-[#34d399] font-bold text-right flex items-center justify-end gap-0.5">
                  Abrir Tomo <ChevronRight className="w-3.5 h-3.5" />
                </div>
              ) : (
                <Link href="/#tiers" className="text-[9px] text-[#fb923c] font-bold text-right block hover:underline">
                  Fazer Upgrade →
                </Link>
              )}
            </Card>
          ))}
        </div>

        {/* Right: Book Reader View */}
        <div className="md:col-span-2">
          {selectedTomo ? (
            <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-6 shadow-xl space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-base font-extrabold text-[#f4ebd0]">{selectedTomo.name}</h3>
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 cozy-scroll">
                  {selectedTomo.chapters.map((ch, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setReadingChapter(ch)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all shrink-0 ${
                        readingChapter?.title === ch.title 
                          ? "bg-[#8b5a2b] text-[#f4ebd0] border-[#cd853f]" 
                          : "bg-[#121214] text-[#94a3b8] border-white/5 hover:text-[#f4ebd0]"
                      }`}
                    >
                      {ch.title.split(":")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {readingChapter ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#fb923c] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#fb923c]" /> {readingChapter.title}
                  </h4>
                  <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed text-justify bg-[#121214] p-5 border border-white/5 rounded-xl">
                    {readingChapter.content}
                  </p>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-xs text-[#94a3b8]">Selecione um capítulo</div>
              )}
            </div>
          ) : (
            <div className="bg-[#1c1c22]/50 border border-white/5 border-dashed rounded-[20px] p-12 text-center text-xs text-[#94a3b8] min-h-[300px] flex flex-col items-center justify-center gap-3">
              <BookOpen className="w-16 h-16 text-[#cd853f] opacity-50" />
              <h3 className="text-sm font-bold text-[#f4ebd0]">Leitor de Manuscritos</h3>
              <p className="max-w-[280px] leading-normal opacity-70">
                Selecione um dos tomos desbloqueados à esquerda para iniciar sua leitura de lore e regras do RPG.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
