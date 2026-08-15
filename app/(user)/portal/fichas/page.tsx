"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Wifi, 
  Trophy, 
  BookOpen, 
  Flame, 
  Compass, 
  HelpCircle 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FichasPage() {
  const [favClass, setFavClass] = useState("Arquivista");
  const [scannedCards, setScannedCards] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningMessage, setScanningMessage] = useState("");
  const [scannedCardInfo, setScannedCardInfo] = useState<any>(null);

  const [charStats, setCharStats] = useState({
    sabedoria: 12,
    forca: 10,
    destreza: 11,
    inteligencia: 13,
    defesaMagica: "+0",
    magiasLiberadas: ["Ataque Básico (Cajado)"]
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClass = localStorage.getItem("fav-class") || "Arquivista";
      setFavClass(storedClass);

      const storedScans = localStorage.getItem("scanned-cards");
      if (storedScans) {
        try {
          const parsed = JSON.parse(storedScans);
          setScannedCards(parsed);
          applyStatsForCards(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const selectClass = (rpgClass: string) => {
    setFavClass(rpgClass);
    localStorage.setItem("fav-class", rpgClass);
  };

  const clearScans = () => {
    setScannedCards([]);
    localStorage.removeItem("scanned-cards");
    setScannedCardInfo(null);
    setCharStats({
      sabedoria: 12,
      forca: 10,
      destreza: 11,
      inteligencia: 13,
      defesaMagica: "+0",
      magiasLiberadas: ["Ataque Básico (Cajado)"]
    });
  };

  const applyStatsForCards = (cardsList: string[]) => {
    let bonusSab = 0;
    let bonusInt = 0;
    let defMag = "+0";
    const spells = ["Ataque Básico (Cajado)"];

    if (cardsList.includes("Grimório do Aprendiz")) {
      bonusSab += 2;
      spells.push("Faísca de Tinta (1d6)");
    }
    if (cardsList.includes("Chave do Silenciador")) {
      defMag = "+3 contra Magia";
      spells.push("Silêncio da Biblioteca (Área)");
    }
    if (cardsList.includes("Lente do Guardião Sênior")) {
      bonusInt += 3;
      spells.push("Visão de Bibliófagos (Passivo)");
    }

    setCharStats({
      sabedoria: 12 + bonusSab,
      forca: 10,
      destreza: 11,
      inteligencia: 13 + bonusInt,
      defesaMagica: defMag,
      magiasLiberadas: spells
    });
  };

  const simulateNfcScan = (cardName: string, desc: string, statsChange: string) => {
    setIsScanning(true);
    setScannedCardInfo(null);
    setScanningMessage("Aproxime o cartão físico do leitor NFC...");
    
    setTimeout(() => {
      setScanningMessage(`Conectando com o chip NFC... [#${cardName.slice(0,3).toUpperCase()}]`);
      
      setTimeout(() => {
        setIsScanning(false);
        if (scannedCards.includes(cardName)) {
          setScanningMessage("Cartão já registrado!");
          return;
        }

        const newScans = [...scannedCards, cardName];
        setScannedCards(newScans);
        localStorage.setItem("scanned-cards", JSON.stringify(newScans));
        
        applyStatsForCards(newScans);

        setScannedCardInfo({
          name: cardName,
          desc: desc,
          change: statsChange
        });
        setScanningMessage("Escaneado! Ficha de personagem atualizada.");
      }, 800);
    }, 1000);
  };

  const availableMockCards = [
    {
      name: "Grimório do Aprendiz",
      desc: "Cartão de Madeira NFC. Dá +2 de Sabedoria e libera a magia 'Faísca de Tinta'.",
      change: "+2 Sabedoria, Feitiço 'Faísca de Tinta'",
      icon: Sparkles
    },
    {
      name: "Chave do Silenciador",
      desc: "Cartão de Metal NFC. Dá +3 de Defesa contra Magia e concede a barreira 'Silêncio'.",
      change: "+3 Defesa Mágica, Ritual 'Silêncio'",
      icon: Flame
    },
    {
      name: "Lente do Guardião Sênior",
      desc: "Cartão Holográfico NFC. Dá +3 de Inteligência e adiciona 'Visão de Bibliófagos'.",
      change: "+3 Inteligência, Habilidade de Investigar",
      icon: Compass
    }
  ];

  return (
    <div className="space-y-8 font-cozy relative z-10 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#f4ebd0]">Ficha de Personagem NFC</h2>
        <p className="text-xs text-[#94a3b8] mt-1">Conecte seus cartões físicos e visualize suas perícias e atributos digitais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat detail inputs */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main Card stats */}
          <div className="bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#fb923c] p-6 rounded-[20px] shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-[#f4ebd0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#fb923c]" /> Atributos e Perícias Digitais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#121214] p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-[9px] text-[#94a3b8] uppercase font-bold">Ordem Escolhida</span>
                <div className="text-sm font-bold text-[#34d399] mt-0.5">{favClass}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-[#94a3b8] uppercase font-bold block">Alterar Ordem</span>
                <div className="flex flex-wrap gap-1">
                  {["Arquivista", "Bibliotecário", "Encadernador"].map(cls => (
                    <button 
                      key={cls}
                      onClick={() => selectClass(cls)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                        favClass === cls ? "border-[#10b981] bg-[#10b981]/10 text-[#34d399]" : "border-white/5 text-[#94a3b8]"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid display attributes */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-[#121214] p-3 rounded-lg border border-white/5">
                <span className="text-[8px] text-[#94a3b8] block">Sabedoria</span>
                <span className="text-lg font-black text-[#fb923c]">{charStats.sabedoria}</span>
              </div>
              <div className="bg-[#121214] p-3 rounded-lg border border-white/5">
                <span className="text-[8px] text-[#94a3b8] block">Inteligência</span>
                <span className="text-lg font-black text-[#34d399]">{charStats.inteligencia}</span>
              </div>
              <div className="bg-[#121214] p-3 rounded-lg border border-white/5">
                <span className="text-[8px] text-[#94a3b8] block">Força</span>
                <span className="text-lg font-black text-[#f4ebd0]">{charStats.forca}</span>
              </div>
              <div className="bg-[#121214] p-3 rounded-lg border border-white/5">
                <span className="text-[8px] text-[#94a3b8] block">Defesa Mágica</span>
                <span className="text-[10px] font-bold text-indigo-300 block truncate mt-1">{charStats.defesaMagica}</span>
              </div>
            </div>

            {/* List active spells */}
            <div className="space-y-2">
              <span className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Feitiços Conjuráveis</span>
              <div className="flex flex-wrap gap-1.5">
                {charStats.magiasLiberadas.map((spell, idx) => (
                  <span key={idx} className="bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-indigo-300 px-3 py-1 rounded-full">
                    ★ {spell}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* NFC scan column */}
        <div className="space-y-6">
          
          <div className="bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4 text-center">
            <h3 className="text-sm font-bold text-[#f4ebd0]">Scanner NFC Integrado</h3>
            
            {/* Screen */}
            <div className="min-h-[140px] bg-[#121214] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
              {isScanning ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-4 border-t-[#34d399] border-[#10b981]/25 animate-spin flex items-center justify-center">
                    <Wifi className="w-4 h-4 text-[#34d399]" />
                  </div>
                  <p className="text-[10px] text-[#34d399] animate-pulse">{scanningMessage}</p>
                </div>
              ) : scannedCardInfo ? (
                <div className="space-y-1 flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-[#34d399] mb-1" />
                  <h4 className="text-xs font-bold text-[#f4ebd0]">{scannedCardInfo.name}</h4>
                  <p className="text-[9px] text-[#94a3b8] leading-tight">{scannedCardInfo.desc}</p>
                  <span className="text-[9px] text-[#34d399] bg-[#34d399]/10 px-2 py-0.5 rounded-full mt-1 font-bold">{scannedCardInfo.change}</span>
                </div>
              ) : (
                <div className="space-y-1.5 text-[#94a3b8] flex flex-col items-center">
                  <Wifi className="w-8 h-8 animate-pulse text-[#94a3b8]/40" />
                  <p className="text-xs">Scanner Pronto</p>
                  <p className="text-[9px] opacity-60">Escolha um cartão virtual abaixo</p>
                </div>
              )}
            </div>

            {scannedCards.length > 0 && (
              <Button onClick={clearScans} className="w-full bg-red-950/40 hover:bg-red-900/30 border border-red-500/20 text-red-300 text-[10px] h-8 rounded-full">
                Limpar Equipamentos NFC
              </Button>
            )}

            {/* Selector list */}
            <div className="text-left space-y-2">
              <span className="text-[9px] text-[#94a3b8] uppercase font-bold">Simular Cartões Colecionáveis</span>
              <div className="flex flex-col gap-2">
                {availableMockCards.map((c, idx) => {
                  const Icon = c.icon;
                  const active = scannedCards.includes(c.name);
                  return (
                    <div key={idx} className="p-3 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#fb923c]" />
                        <div>
                          <h4 className="text-[10px] font-bold text-[#f4ebd0]">{c.name}</h4>
                        </div>
                      </div>
                      <button 
                        onClick={() => simulateNfcScan(c.name, c.desc, c.change)}
                        disabled={isScanning || active}
                        className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                          active ? "bg-white/5 text-[#94a3b8] cursor-not-allowed" : "bg-[#f97316] text-[#121214] hover:bg-[#fb923c]"
                        }`}
                      >
                        {active ? "Lido" : "Aproximar"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
