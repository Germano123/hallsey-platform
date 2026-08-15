"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth.context";
import { WishlistService, WishlistEntry } from "@/lib/services/wishlist.service";
import { 
  BookOpen, 
  Sparkles, 
  CreditCard, 
  Flame, 
  User, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  Clock,
  Coins,
  Library,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LandingPage() {
  const { user } = useAuth();
  const wishlistService = new WishlistService();

  // State variables
  const [wishlistCount, setWishlistCount] = useState<number>(1284);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favClass, setFavClass] = useState("Arquivista");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // NFC Cards Interactive State
  const [selectedCard, setSelectedCard] = useState<number>(0);

  // Crowdfunding details
  const currentFunding = 42850;
  const targetFunding = 50000;
  const fundingPercent = Math.round((currentFunding / targetFunding) * 100);

  // Load wishlist size to add to base count
  useEffect(() => {
    wishlistService.getWishlist().then(list => {
      setWishlistCount(1284 + list.length);
    });
  }, []);

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
      // Fetch wishlist again to update count
      const list = await wishlistService.getWishlist();
      setWishlistCount(1284 + list.length);
    } catch (err) {
      setErrorMsg("Erro ao registrar. Tente novamente.");
    }
  };

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
    <div className="min-h-screen bg-[#121214] text-[#f4ebd0] font-cozy selection:bg-[#f97316] selection:text-[#121214] overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-[#121214]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-xl flex items-center justify-center border border-[#cd853f]/30">
            <Library className="w-5 h-5 text-[#f4ebd0]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#f4ebd0] leading-none">Biblioteca da 5ª Avenida</h1>
            <span className="text-[10px] text-[#34d399] tracking-wider uppercase font-medium">RPG Crowdfunding</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#narrativa" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">A História</a>
          <a href="#mecanica-nfc" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">Cartões NFC</a>
          <a href="#wishlist" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">Wishlist</a>
          <a href="#tiers" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors">Recompensas</a>
          <Link href="/blog" className="text-[#94a3b8] hover:text-[#f4ebd0] transition-colors flex items-center gap-1">
            Blog <span className="px-1.5 py-0.5 text-[9px] bg-[#fb923c]/20 text-[#fb923c] rounded-full">Novidades</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="px-5 py-2 rounded-full border-2 border-[#10b981] text-[#34d399] hover:bg-[#10b981]/10 text-xs font-semibold transition-all">
              Acessar Portal ({user.name?.split(" ")[0]})
            </Link>
          ) : (
            <Link href="/login" className="px-5 py-2 rounded-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] text-xs font-semibold transition-all shadow-md shadow-[#f97316]/20">
              Entrar
            </Link>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Glow ambient background */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#10b981]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f97316]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 flex flex-col gap-6 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 bg-[#8b5a2b]/20 border border-[#cd853f]/40 px-3.5 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-[#fb923c] text-xs font-semibold">Lançamento de Financiamento Coletivo</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f4ebd0] leading-tight">
            Descubra os Mistérios da <br />
            <span className="bg-gradient-to-r from-[#fb923c] via-[#f4ebd0] to-[#34d399] bg-clip-text text-transparent">
              Biblioteca da 5ª Avenida
            </span>
          </h2>

          <p className="text-base md:text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
            Um RPG de mesa de fantasia urbana onde livros esquecidos são portais para universos em colapso. Pela primeira vez no Brasil, jogue com **Cartões NFC Físicos Colecionáveis** integrados diretamente à sua ficha digital e ao tabuleiro virtual!
          </p>

          {/* Crowdfunding Live Stats Block */}
          <div className="p-6 bg-[#1c1c22] border border-white/5 rounded-2xl shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs text-[#94a3b8] uppercase font-medium">Meta Apoiada</span>
                <div className="text-2xl font-bold text-[#f4ebd0]">
                  R$ {currentFunding.toLocaleString("pt-BR")} <span className="text-xs font-normal text-[#94a3b8]">de R$ {targetFunding.toLocaleString("pt-BR")}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#94a3b8] uppercase font-medium">Progresso</span>
                <div className="text-2xl font-bold text-[#34d399]">{fundingPercent}%</div>
              </div>
            </div>

            {/* Target bar */}
            <div className="w-full h-3.5 bg-[#121214] rounded-full overflow-hidden border border-white/5 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#f97316] to-[#34d399] rounded-full transition-all duration-1000" 
                style={{ width: `${fundingPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
              <div>
                <div className="text-sm font-semibold text-[#f4ebd0]">432</div>
                <div className="text-[10px] text-[#94a3b8] uppercase">Apoiadores</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#f4ebd0]">18 Dias</div>
                <div className="text-[10px] text-[#94a3b8] uppercase">Restantes</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#34d399] flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 inline" /> {wishlistCount}
                </div>
                <div className="text-[10px] text-[#94a3b8] uppercase">Na Wishlist</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a href="#wishlist" className="btn btn-primary text-center px-8 py-3 rounded-full text-sm font-bold bg-[#f97316] text-[#121214]">
              Garantir Meu Acesso (Wishlist)
            </a>
            <a href="#mecanica-nfc" className="btn btn-secondary text-center px-8 py-3 rounded-full text-sm font-bold border-2 border-[#10b981] text-[#34d399]">
              Conhecer Ficha NFC
            </a>
          </div>
        </div>

        {/* Hero visual: Immersive card visual deck */}
        <div className="flex-1 w-full flex justify-center relative z-10">
          <div className="relative w-80 h-[450px]">
            {/* Background glowing frame */}
            <div className="absolute inset-0 bg-[#8b5a2b]/20 rounded-[30px] border border-[#cd853f]/30 transform -rotate-3 scale-105 shadow-2xl" />
            <div className="absolute inset-0 bg-[#1c1c22] rounded-[30px] border border-white/10 p-6 flex flex-col justify-between shadow-2xl transform rotate-1 transition-transform hover:rotate-0 duration-500">
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#fb923c] font-bold tracking-widest uppercase">Tomo Oficial RPG</span>
                <span className="px-2 py-0.5 text-[9px] bg-red-950 text-red-400 border border-red-500/20 rounded-full">Físico + Digital</span>
              </div>

              {/* Mock Image Box */}
              <div className="w-full h-48 bg-[#121214] border border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                {/* Simulated game art */}
                <Library className="w-16 h-16 text-[#cd853f] opacity-80 group-hover:scale-110 transition-transform duration-300 relative z-20" />
                <div className="text-xs text-[#94a3b8] absolute bottom-3 text-center w-full z-20 font-medium">Biblioteca Oculta da 5ª Avenida</div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-lg font-bold text-[#f4ebd0]">Livro de Regras Luxo</h3>
                <p className="text-xs text-[#94a3b8] leading-normal">
                  Capa dura com detalhes em hot stamping dourado, mais de 300 páginas de cenários, monstros bibliófagos, regras e 5 cartões NFC iniciais inclusos.
                </p>
                <div className="flex items-center gap-1 text-xs text-[#34d399] font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Inclui Tabuleiro Virtual Integrado
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-[#94a3b8]">A partir de:</span>
                <span className="text-xl font-black text-[#fb923c]">R$ 189,90</span>
              </div>
            </div>
            
            {/* Decored small floating card representing NFC card */}
            <div className="absolute -bottom-6 -right-6 w-36 h-52 bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-500/40 rounded-xl shadow-2xl p-3 flex flex-col justify-between transform rotate-12 hover:rotate-6 duration-300 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-indigo-300 font-bold uppercase">NFC Deck</span>
                <Sparkles className="w-2.5 h-2.5 text-indigo-300" />
              </div>
              <div className="w-full h-20 bg-black/40 rounded-lg flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-indigo-300" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-[#f4ebd0]">Grimório Ébano</h4>
                <p className="text-[8px] text-[#94a3b8] mt-0.5">Aproxime para invocar</p>
              </div>
              <div className="text-[9px] text-[#34d399] text-right font-bold">Nível 3</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Narrativa Section */}
      <section id="narrativa" className="py-20 px-6 md:px-12 bg-[#0c0c0e] border-y border-white/5">
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

      {/* 4. NFC Mechanic Section */}
      <section id="mecanica-nfc" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#34d399]/30 px-3 py-1 rounded-full text-xs text-[#34d399] font-medium uppercase tracking-wider">
            Mecânica Físico-Digital Revolucionária
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#f4ebd0]">O Poder das Cartas NFC</h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto text-sm md:text-base">
            Seus feitiços, itens lendários e companheiros estão selados em **cartões físicos colecionáveis** equipados com chips NFC. Encoste-os no celular ou leitor USB e veja a mágica acontecer!
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

      {/* 5. Wishlist Section */}
      <section id="wishlist" className="py-20 px-6 md:px-12 bg-[#0c0c0e] border-y border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f97316]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#f97316] to-red-950 rounded-2xl flex items-center justify-center border border-[#fb923c]/30 shadow-md mx-auto mb-6">
            <Flame className="w-7 h-7 text-[#f4ebd0]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#f4ebd0]">Cadastre-se na Wishlist do Lançamento</h2>
          <p className="text-xs text-[#34d399] tracking-wider uppercase font-semibold mt-1">
            Garanta brindes exclusivos e libere um cartão NFC extra no kick-off!
          </p>
          <p className="text-sm text-[#94a3b8] mt-4 leading-relaxed">
            Nossos apoiadores da Wishlist receberão o Tomo I Digital gratuitamente e um selo cosmético exclusivo no portal oficial de jogo.
          </p>

          {submitted ? (
            <div className="mt-8 p-6 bg-emerald-950/40 border border-[#10b981]/30 rounded-2xl flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-[#34d399] animate-bounce" />
              <h3 className="text-lg font-bold text-[#f4ebd0]">Iniciação Efetuada com Sucesso!</h3>
              <p className="text-xs text-[#94a3b8]">Você se juntou à ordem dos {favClass}s. Notificaremos você assim que o financiamento começar e liberarmos o Tomo I.</p>
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

              <div className="space-y-1">
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
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold h-11 rounded-[30px] shadow-lg shadow-[#f97316]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mt-4"
              >
                Garantir Vaga na Wishlist
              </Button>
            </form>
          )}

          <div className="mt-4 text-xs text-[#94a3b8]">
            Junte-se a <span className="text-[#34d399] font-bold">{wishlistCount} guardiões</span> prontos para reescrever as páginas.
          </div>
        </div>
      </section>

      {/* 6. Crowdfunding Tiers Section */}
      <section id="tiers" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
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

      {/* 7. Design Diagonal Slideshow Showcase */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
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

      {/* 8. Cozy Footer */}
      <footer className="bg-[#0c0c0e] border-t border-[#5c3a21] py-12 px-6 md:px-12 mt-12 text-center text-[#94a3b8]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-lg flex items-center justify-center border border-[#cd853f]/30">
              <Library className="w-4 h-4 text-[#f4ebd0]" />
            </div>
            <span className="font-bold text-[#f4ebd0] text-sm">Biblioteca da 5ª Avenida</span>
          </div>

          <div className="flex gap-6 text-xs font-semibold">
            <Link href="/blog" className="hover:text-[#f4ebd0] transition-colors">Blog</Link>
            <Link href="/login" className="hover:text-[#f4ebd0] transition-colors">Entrar no Portal</Link>
            <Link href="#wishlist" className="hover:text-[#f4ebd0] transition-colors">Cadastrar Wishlist</Link>
          </div>
        </div>
        <div className="text-[11px] mt-8 opacity-60">
          © 2026 Biblioteca da 5ª Avenida RPG. Feito com amor, café e cartas NFC.
        </div>
      </footer>

    </div>
  );
}
