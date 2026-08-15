"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/contexts/auth.context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Trophy, Sparkles, CheckCircle } from "lucide-react";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favClass, setFavClass] = useState("Arquivista");
  const [backingTier, setBackingTier] = useState("Guardião Físico (R$ 189)");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
    if (typeof window !== "undefined") {
      const storedClass = localStorage.getItem("fav-class") || "Arquivista";
      setFavClass(storedClass);

      const storedTier = localStorage.getItem("backing-tier") || "Guardião Físico (R$ 189)";
      setBackingTier(storedTier);
    }
  }, [user]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("fav-class", favClass);
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 font-cozy relative z-10 max-w-xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#f4ebd0]">Perfil do Guardião</h2>
        <p className="text-xs text-[#94a3b8] mt-1">Gerencie suas preferências de jogo, apelido e consulte seu faturamento de apoio.</p>
      </div>

      <Card className="p-6 md:p-8 bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#fb923c] rounded-[20px] shadow-2xl relative">
        <form onSubmit={handleSave} className="space-y-5">
          
          {submitted && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Preferências salvas com sucesso!
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="prof-name" className="text-xs text-[#f4ebd0]">Nome de Guardião / Codinome</Label>
            <Input 
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#121214] border-white/10 text-xs rounded-lg text-[#f4ebd0] h-10"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-[#f4ebd0]">Email de Acesso (Não alterável)</Label>
            <Input 
              value={email}
              disabled
              className="bg-[#121214]/60 border-white/5 text-xs rounded-lg text-[#94a3b8] h-10 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="prof-class" className="text-xs text-[#f4ebd0]">Sua Classe de Jogo Favorita</Label>
            <select
              id="prof-class"
              value={favClass}
              onChange={(e) => setFavClass(e.target.value)}
              className="w-full bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-xs h-10 px-3 focus:outline-none"
            >
              <option value="Arquivista">Arquivista (Foco em investigações e magias antigas)</option>
              <option value="Bibliotecário">Bibliotecário (Foco em defesa e restauração de textos)</option>
              <option value="Encadernador">Encadernador (Foco em forja física de armas e armaduras de livro)</option>
              <option value="Tecelão do Verbo">Tecelão do Verbo (Foco em conjuração elemental e poções)</option>
            </select>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider block">Categoria de Apoio Crowdfunding</span>
            <div className="bg-[#121214] p-3.5 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-[#94a3b8] block uppercase">Nível do Apoio</span>
                <span className="text-xs font-bold text-[#fb923c]">{backingTier}</span>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#34d399] opacity-80" />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold h-11 rounded-[30px] shadow-lg shadow-[#f97316]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mt-4"
          >
            Salvar Preferências
          </Button>

        </form>
      </Card>
      
    </div>
  );
}
