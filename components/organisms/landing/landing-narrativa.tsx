"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export function LandingNarrativa() {
  return (
    <section id="narrativa" className="py-20 px-6 md:px-12 bg-[#0c0c0e] border-y border-white/5 font-cozy">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="w-12 h-12 bg-[#8b5a2b]/15 border border-[#cd853f]/40 rounded-full flex items-center justify-center mx-auto text-[#fb923c]">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#f4ebd0]">A História: O Silêncio das Páginas Rasgadas</h2>
        
        <div className="w-24 h-1 bg-[#8b5a2b] mx-auto rounded-full" />
        
        <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed text-justify md:text-center max-w-3xl mx-auto">
          Por trás das prateleiras empoeiradas e das portas trancadas da antiga Biblioteca da 5ª Avenida, reside o maior segredo da humanidade. Os livros catalogados ali não são simples registros textuais, mas portais selados para reinos paralelos chamados **Textos-Mundo**. 
        </p>
        <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed text-justify md:text-center max-w-3xl mx-auto">
          Recentemente, uma praga conhecida como os **Bibliófagos Sombrios** começou a corroer os textos originais, apagando heróis, alterando magias e colapsando as realidades contidas neles. Como um **Guardião da Palavra**, seu dever é mergulhar nas páginas, combater a corrupção e reescrever a história correta antes que o tomo se feche para sempre.
        </p>
      </div>
    </section>
  );
}
