"use client";

import React, { useState } from "react";
import { Sparkles, Flame, BookOpen, CreditCard } from "lucide-react";

export function LandingNfcMechanic() {
  const [selectedCard, setSelectedCard] = useState<number>(0);

  const nfcCards = [
    {
      id: 0,
      name: "Grimório do Aprendiz",
      type: "Item Mágico (Acessório)",
      icon: Sparkles,
      color: "from-[#8b5a2b] to-[#cd853f]",
      desc: "Cartão físico de madeira de carvalho gravado a laser. Libera o feitiço 'Faísca de Tinta' e dá +2 de Sabedoria ao portador quando aproximado da mesa.",
      stats: { ataque: "1d6 + 2 Arcano", alcance: "12 metros", custo: "1 Ponto de Tomo", raridade: "Comum" },
      glow: "border-[#cd853f]"
    },
    {
      id: 1,
      name: "Chave do Silenciador",
      type: "Relíquia Sombria",
      icon: Flame,
      color: "from-purple-900 to-[#cd853f]",
      desc: "Cartão de metal escovado dourado com chip NFC embutido. Ao ser escaneado, invoca a barreira de 'Silêncio da Biblioteca', impedindo conjurações hostis na sala.",
      stats: { defesa: "+3 contra Magia", area: "Raio de 6m", duracao: "3 turnos", raridade: "Raro" },
      glow: "border-purple-500"
    },
    {
      id: 2,
      name: "Lente do Guardião Sênior",
      type: "Foco de Investigação",
      icon: BookOpen,
      color: "from-[#10b981] to-emerald-950",
      desc: "Cartão plástico translúcido premium holográfico. Permite enxergar pegadas de bibliófagos sombrios e ler escritas invisíveis nas paredes da Biblioteca.",
      stats: { percepcao: "+5 Investigar", recarga: "Descanso Curto", duracao: "Passivo", raridade: "Lendário" },
      glow: "border-[#34d399]"
    }
  ];

  return (
    <section id="mecanica-nfc" className="py-20 px-6 md:px-12 max-w-7xl mx-auto font-cozy">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#34d399]/30 px-3 py-1 rounded-full text-xs text-[#34d399] font-medium uppercase tracking-wider">
          Mecânica Físico-Digital Revolucionária
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#f4ebd0]">O Poder das Cartas NFC</h2>
        <p className="text-[#94a3b8] max-w-2xl mx-auto text-sm md:text-base">
          Seus feitiços, itens lendários e companheiros estão selados em <b>cartões físicos colecionáveis</b> equipados com chips NFC. Encoste-os no celular ou leitor USB e veja a mágica acontecer!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Card Deck Showcase */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full justify-center">
          {nfcCards.map((card, i) => {
            const IconComp = card.icon;
            return (
              <div 
                key={card.id}
                onClick={() => setSelectedCard(i)}
                className={`flex-1 p-5 rounded-2xl bg-[#1c1c22] border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between h-72 shadow-xl hover:-translate-y-2 ${
                  selectedCard === i ? `${card.glow} bg-gradient-to-b from-[#1c1c22] to-white/5` : "border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#94a3b8] uppercase tracking-wide font-medium">{card.type}</span>
                  <IconComp className={`w-4 h-4 ${selectedCard === i ? "text-[#34d399] animate-pulse" : "text-[#94a3b8]"}`} />
                </div>

                <div className={`w-full h-24 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center border border-white/10 overflow-hidden relative group`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <CreditCard className="w-8 h-8 text-white relative z-10" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#f4ebd0]">{card.name}</h3>
                  <p className="text-[10px] text-[#94a3b8] mt-1 line-clamp-2">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Info Panel */}
        <div className="flex-1 w-full bg-[#1c1c22] border border-white/5 rounded-[20px] p-8 shadow-2xl relative">
          <div className="absolute top-4 right-4 bg-[#8b5a2b]/20 border border-[#cd853f]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#fb923c]">
            CARTÃO SELECIONADO
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs text-[#34d399] font-bold uppercase tracking-wider">
                {nfcCards[selectedCard].type}
              </span>
              <h3 className="text-2xl font-bold text-[#f4ebd0] mt-1">{nfcCards[selectedCard].name}</h3>
            </div>

            <p className="text-sm text-[#94a3b8] leading-relaxed">
              {nfcCards[selectedCard].desc}
            </p>

            <div>
              <h4 className="text-xs text-[#f4ebd0] font-bold uppercase border-b border-white/5 pb-2 mb-3">Atributos Digitais Desbloqueados</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(nfcCards[selectedCard].stats).map(([key, val]) => (
                  <div key={key} className="bg-[#121214] p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] capitalize">{key}</span>
                    <div className="text-sm font-semibold text-[#f4ebd0] mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#8b5a2b]/10 border border-[#cd853f]/20 rounded-lg text-xs text-[#fb923c] leading-normal flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Esse cartão acompanha fisicamente os pacotes colecionadores da campanha e pode ser lido em qualquer smartphone moderno sem aplicativos adicionais.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
