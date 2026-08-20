"use client";

import React from "react";

export function LandingSlideshow() {
  return (
    <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto font-cozy">
      <h3 className="text-lg font-bold text-center text-[#94a3b8] mb-6 uppercase tracking-widest">Ambientações e Arte Conceitual</h3>
      
      <div className="project-slideshow rounded-[20px] border border-white/5 shadow-2xl">
        {/* Slide 1 */}
        <div 
          className="slide cursor-pointer" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop')` 
          }}
        >
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h4 className="text-[#f4ebd0] font-bold text-lg">Os Corredores de Ébano</h4>
            <p className="text-xs text-[#94a3b8] mt-1">Setor proibido onde repousam livros amaldiçoados de alta periculosidade.</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div 
          className="slide cursor-pointer" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop')` 
          }}
        >
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h4 className="text-[#f4ebd0] font-bold text-lg">O Grande Salão do Arquivista</h4>
            <p className="text-xs text-[#94a3b8] mt-1">Área segura onde guardiões se reúnem para traduzir escritas e recuperar feitiços.</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div 
          className="slide cursor-pointer" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop')` 
          }}
        >
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h4 className="text-[#f4ebd0] font-bold text-lg">Bibliófagos no Escuro</h4>
            <p className="text-xs text-[#94a3b8] mt-1">Larvas sombrias alimentam-se das palavras, alterando realidades inteiras.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
