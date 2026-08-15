"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { WishlistService } from "@/lib/services/wishlist.service";
import { Library, Sparkles, Flame, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WishlistPage() {
  const wishlistService = new WishlistService();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favClass, setFavClass] = useState("Arquivista");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [totalCount, setTotalCount] = useState(1284);

  useEffect(() => {
    wishlistService.getWishlist().then((list) => {
      setTotalCount(1284 + list.length);
    });
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await wishlistService.addToWishlist({
        name,
        email,
        favoriteClass: favClass,
      });
      setSubmitted(true);
      const list = await wishlistService.getWishlist();
      setTotalCount(1284 + list.length);
    } catch (error) {
      setErrorMsg("Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center p-4 font-cozy relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10b981]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f97316]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[#34d399] hover:text-[#10b981] transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para a página principal
        </Link>
      </div>

      <div className="w-full max-w-[550px] bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#8b5a2b] rounded-[20px] shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-2xl flex items-center justify-center border border-[#cd853f]/30 shadow-md">
            <Library className="w-8 h-8 text-[#f4ebd0]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#f4ebd0]">Ordem da Estante Secreta</h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Cadastre-se na wishlist oficial de financiamento e libere brindes
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#10b981]/5 border border-[#10b981]/30 rounded-xl text-center space-y-4 flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-[#34d399] animate-bounce" />
            <h3 className="text-lg font-bold text-[#f4ebd0]">Guardião Registrado na Biblioteca!</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Você agora é um **{favClass}** oficial. Seu nome foi gravado nas estantes da Biblioteca. Assim que o financiamento começar, você receberá um e-mail com instruções para receber seu Tomo I Digital e o brinde de apoio prévio.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button className="bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold px-6 py-2 rounded-full text-xs">
                  Voltar para Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="reg-name" className="text-xs font-semibold text-[#f4ebd0]">Nome ou Codinome</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] h-10 rounded-lg placeholder-white/10"
                placeholder="Ex: Mago Solitário, Bruno"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-email" className="text-xs font-semibold text-[#f4ebd0]">E-mail Principal</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] h-10 rounded-lg placeholder-white/10"
                placeholder="guardiao@exemplo.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-class" className="text-xs font-semibold text-[#f4ebd0]">Classe Favorita</Label>
              <select
                id="reg-class"
                value={favClass}
                onChange={(e) => setFavClass(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 focus-visible:ring-[#10b981] rounded-lg text-[#f4ebd0] h-10 px-3 text-sm focus:outline-none"
              >
                <option value="Arquivista">Arquivista (Foco em investigações e magias antigas)</option>
                <option value="Bibliotecário">Bibliotecário (Foco em defesa e restauração de textos)</option>
                <option value="Encadernador">Encadernador (Foco em forja física de armas e armaduras de livro)</option>
                <option value="Tecelão do Verbo">Tecelão do Verbo (Foco em conjuração elemental e poções)</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold h-11 rounded-[30px] shadow-lg shadow-[#f97316]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mt-4"
            >
              Registrar e Reservar Tomo I Digital
            </Button>
          </form>
        )}

        <div className="text-center mt-6 pt-4 border-t border-white/5">
          <p className="text-xs text-[#94a3b8]">
            Há atualmente <span className="text-[#34d399] font-bold">{totalCount} guardiões</span> em nossa wishlist.
          </p>
        </div>
      </div>
    </div>
  );
}
