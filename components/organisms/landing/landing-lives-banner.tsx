"use client";

import React from "react";
import { Calendar, Tv, Sparkles } from "lucide-react";

export function LandingLivesBanner() {
  const schedule = [
    { day: "Quarta-feira", time: "20:00", title: "Biblioteca da 5ª Avenida" },
    { day: "Sexta-feira", time: "21:00", title: "Biblioteca da 5ª Avenida" },
    { day: "Sábado", time: "20:00", title: "Biblioteca da 5ª Avenida" },
  ];

  return (
    <section className="relative bg-[#1c1c22] border-y border-zinc-800 py-12 px-6 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-[#f97316]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Pitch & Text info */}
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-xs font-bold text-[#fb923c]">
            <Sparkles className="w-3.5 h-3.5" />
            Transmissões Especiais
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#f4ebd0]">
            Próxima Semana: As Lives de Apresentação
          </h2>
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
            Preparem seus tomos! Vamos apresentar o nosso sistema de RPG completo ao vivo. Conheça as classes exclusivas, veja a criação de personagens e assista à demonstração em tempo real das mecânicas NFC.
          </p>

          {/* Social CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
            <a 
              href="https://www.twitch.tv/hallseydev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#772ce8] text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#9146FF]/20 hover:scale-105"
            >
              <Tv className="w-4 h-4" />
              Acompanhar na Twitch
            </a>
            
            <a 
              href="https://www.tiktok.com/@_profhallsey?_r=1&_t=ZS-99BaB5kO8qT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black hover:bg-[#121214] text-white border border-zinc-800 font-extrabold text-sm px-6 py-3 rounded-xl transition-all hover:scale-105"
            >
              {/* Custom high quality TikTok SVG */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.92-1.88 2.66-5.66 3.42-8.47 1.71-2.22-1.32-3.32-3.87-2.88-6.42.36-2.21 2.12-3.97 4.31-4.36 1.34-.23 2.72.06 3.89.82V2.93c-1.22-.38-2.5-.53-3.77-.45-1.2.06-2.39.38-3.48.92C5.07 4.14 3.73 5.48 2.93 7.07 1.31 10.23 1.83 14.34 4.17 16.97c1.78 2.01 4.41 3.09 7.07 2.98 2.51-.08 4.88-1.42 6.16-3.6 1.11-1.88 1.34-4.19 1.22-6.36.02-3.33 0-6.66.01-9.97-1.7.02-3.42-.31-4.9-1.18-.84-.5-1.57-1.2-2.12-2.02-.32-.48-.56-1-.75-1.54-.15-.43-.22-.9-.3-1.37.07-.01.07-.01.07-.01z"/>
              </svg>
              Seguir no TikTok
            </a>
          </div>
        </div>

        {/* Schedule box / visual representation */}
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Calendar className="w-5 h-5 text-[#f97316]" />
            <h3 className="font-bold text-[#f4ebd0] text-sm">Cronograma das Lives</h3>
          </div>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col gap-1 p-3 rounded-lg bg-[#1c1c22] border border-white/5 hover:border-zinc-800 transition-colors"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#10b981]">{item.day}</span>
                  <span className="text-zinc-400 font-bold">{item.time}h</span>
                </div>
                <span className="text-xs font-semibold text-white">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
