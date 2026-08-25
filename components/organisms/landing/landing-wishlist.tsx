"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { WishlistService } from "@/lib/services/wishlist.service";
import { Flame, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LandingWishlist() {
  const wishlistService = new WishlistService();

  const [wishlistCount, setWishlistCount] = useState<number>(1284);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favClass, setFavClass] = useState("Arquivista");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadWishlistCount = useCallback(() => {
    wishlistService.getWishlist().then(list => {
      setWishlistCount(1284 + list.length);
    });
  }, []);

  useEffect(() => {
    loadWishlistCount();
  }, [loadWishlistCount]);

  const handleWishlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name || !email) {
      setErrorMsg("Por favor, preencha nome e e-mail.");
      return;
    }

    try {
      await wishlistService.addToWishlist({
        name,
        email,
        favoriteClass: favClass
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      loadWishlistCount();
    } catch (err) {
      setErrorMsg("Erro ao registrar. Tente novamente.");
    }
  };

  return (
    <section id="wishlist" className="py-20 px-6 md:px-12 bg-[#0c0c0e] border-y border-white/5 relative font-cozy">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f97316]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-[#f97316] to-red-950 rounded-2xl flex items-center justify-center border border-[#fb923c]/30 shadow-md mx-auto mb-6">
          <Flame className="w-7 h-7 text-[#f4ebd0]" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#f4ebd0]">Cadastre-se na Newsletter de Lançamento</h2>
        <p className="text-xs text-[#34d399] tracking-wider uppercase font-semibold mt-1">
          Garanta brindes exclusivos e libere conteúdos exclusivos no kick-off!
        </p>
        <p className="text-sm text-[#94a3b8] mt-4 leading-relaxed">
          Nossos apoiadores da Newsletter receberão acessos ao Tomo Digital antecipado e um selo cosmético exclusivo no portal oficial de jogo.
        </p>

        {submitted ? (
          <div className="mt-8 p-6 bg-emerald-950/40 border border-[#10b981]/30 rounded-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12 text-[#34d399] animate-bounce" />
            <h3 className="text-lg font-bold text-[#f4ebd0]">Iniciação Efetuada com Sucesso!</h3>
            <p className="text-cozy-xs text-[#94a3b8]">Você se juntou à ordem dos {favClass}s. Notificaremos você assim que o financiamento começar e liberarmos o Tomo I.</p>
            <Button onClick={() => setSubmitted(false)} className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-[#f4ebd0] rounded-full px-4 py-1.5 h-auto">
              Registrar outro Guardião
            </Button>
          </div>
        ) : (
          <form onSubmit={handleWishlistSubmit} className="mt-8 space-y-4 text-left p-6 md:p-8 bg-[#1c1c22] border border-white/5 rounded-2xl shadow-2xl">
            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="wishlist-name" className="text-xs text-[#f4ebd0] font-medium">Nome Completo</Label>
              <Input 
                id="wishlist-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] h-10 rounded-lg placeholder-white/10" 
                placeholder="Seu nome ou apelido de jogo" 
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="wishlist-email" className="text-xs text-[#f4ebd0] font-medium">E-mail</Label>
              <Input 
                id="wishlist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] h-10 rounded-lg placeholder-white/10" 
                placeholder="seuemail@email.com" 
                required
              />
            </div>

            {/* <div className="space-y-1">
              <Label htmlFor="wishlist-class" className="text-xs text-[#f4ebd0] font-medium">Escolha sua Classe RPG favorita</Label>
              <select 
                id="wishlist-class"
                value={favClass}
                onChange={(e) => setFavClass(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 focus-visible:ring-[#10b981] rounded-lg text-[#f4ebd0] h-10 px-3 text-sm focus:outline-none"
              >
                <option value="Arquivista">Arquivista (Foco em investigações e magias antigas)</option>
                <option value="Bibliotecário">Bibliotecário (Foco em defesa e restauração de textos)</option>
                <option value="Encadernador">Encadernador (Foco em forja física de armas e armaduras de livro)</option>
                <option value="Tecelão do Verbo">Tecelão do Verbo (Foco em conjuração elemental e poções)</option>
              </select>
            </div> */}

            <Button 
              type="submit"
              className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold h-11 rounded-[30px] shadow-lg shadow-[#f97316]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mt-4"
            >
              Garantir Vaga na Wishlist
            </Button>
          </form>
        )}

        {/* <div className="mt-4 text-xs text-[#94a3b8]">
          Junte-se a <span className="text-[#34d399] font-bold">{wishlistCount} guardiões</span> prontos para reescrever as páginas.
        </div> */}
      </div>
    </section>
  );
}
