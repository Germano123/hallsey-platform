"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Calendar, 
  User, 
  Library, 
  ArrowLeft,
  ChevronRight,
  Search,
  HelpCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogService, Article } from "@/lib/services/blog.service";
import { useAuth } from "@/contexts/auth.context";

export default function BlogPage() {
  const { user } = useAuth();
  const blogService = new BlogService();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await blogService.getArticles();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles
    .filter(art => !art.status || art.status === "posted")
    .filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#121214] text-[#f4ebd0] font-cozy flex flex-col justify-between selection:bg-[#f97316] selection:text-[#121214]">
      
      {/* Main Page Area */}
      <div className="flex-1">
        
        {/* Header */}
        <header className="bg-[#121214]/90 backdrop-blur-md border-b border-white/5 py-5 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-xl flex items-center justify-center border border-[#cd853f]/30">
              <Library className="w-4 h-4 text-[#f4ebd0]" />
            </Link>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#f4ebd0] leading-none">Biblioteca da 5ª Avenida</h1>
              <span className="text-[9px] text-[#34d399] tracking-wider uppercase font-semibold">Tomo de Notícias</span>
            </div>
          </div>

          <Link 
            href={user ? "/portal" : "/"} 
            className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f4ebd0] transition-colors bg-white/5 border border-white/10 rounded-full px-4 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {user ? "Voltar ao Portal" : "Voltar para Home"}
          </Link>
        </header>

        {/* Ambient Glows */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#10b981]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f97316]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Main Content Layout */}
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          
          {/* Top layout */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#f4ebd0] tracking-tight">O Tomo de Crônicas</h2>
              <p className="text-sm text-[#94a3b8] mt-1">Acompanhe as atualizações de desenvolvimento, novidades de financiamento e contos de lore.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c22] border border-white/10 focus:border-[#34d399] rounded-full text-xs text-[#f4ebd0] h-10 pl-10 pr-4 focus:outline-none placeholder-white/20"
                placeholder="Buscar notícias..."
              />
            </div>
          </div>

          {/* Grid Layout: Left is Articles list, Right is Article Reader */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Area: Grid of articles */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full ${selectedArticle ? "lg:w-[55%]" : "w-full"}`}>
              {loading ? (
                <div className="col-span-full p-12 text-center text-xs text-[#94a3b8]">
                  Carregando artigos do tomo...
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="col-span-full p-12 bg-[#1c1c22] border border-white/5 rounded-2xl text-center text-[#94a3b8]">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 text-[#94a3b8]/40" />
                  Nenhum artigo encontrado com sua pesquisa.
                </div>
              ) : (
                filteredArticles.map(art => (
                  <Card 
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`bg-[#1c1c22] border border-white/5 rounded-2xl overflow-hidden hover:border-[#8b5a2b]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[360px] shadow-xl ${
                      selectedArticle?.id === art.id ? "ring-2 ring-[#f97316] bg-gradient-to-br from-[#1c1c22] to-white/5" : ""
                    }`}
                  >
                    <div>
                      {/* Banner */}
                      <div 
                        className="w-full h-36 bg-cover bg-center border-b border-white/5 relative"
                        style={{ backgroundImage: `url(${art.image})` }}
                      >
                        <span className="absolute top-3 left-3 bg-[#8b5a2b] text-[#f4ebd0] text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-[#cd853f]/30 shadow-md">
                          {art.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-3 text-[10px] text-[#94a3b8]">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {art.date}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {art.author}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#f4ebd0] line-clamp-2 hover:text-[#fb923c] transition-colors">{art.title}</h3>
                        <p className="text-xs text-[#94a3b8] line-clamp-3 leading-relaxed">{art.excerpt}</p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 flex justify-between items-center text-[11px] text-[#fb923c] font-bold">
                      <span>Tempo de leitura: {art.readTime}</span>
                      <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">Ler Artigo <ChevronRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Right Area: Dynamic Article Reader Panel (increased to 45% width) */}
            <div className={`w-full lg:sticky lg:top-24 bg-[#1c1c22] border border-white/5 rounded-[20px] shadow-2xl p-6 md:p-8 flex flex-col gap-6 ${
              selectedArticle ? "lg:w-[45%]" : "hidden"
            }`}>
              {selectedArticle ? (
                <>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] bg-[#fb923c]/20 text-[#fb923c] font-bold uppercase px-2.5 py-1 rounded-full">
                        {selectedArticle.category}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-[#f4ebd0] mt-3 leading-tight">{selectedArticle.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedArticle(null)}
                      className="text-xs text-[#94a3b8] hover:text-[#f4ebd0] p-1.5 hover:bg-white/5 rounded-full border border-white/10 shrink-0"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#94a3b8] border-y border-white/5 py-3">
                    <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}</div>
                    <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedArticle.author}</div>
                  </div>

                  {/* Reduced article preview scroll (excerpt + first paragraph only) */}
                  <div className="space-y-4 text-cozy-sm text-[#94a3b8] leading-relaxed">
                    <p className="text-justify font-bold text-[#f4ebd0] mb-1">Resumo da Notícia:</p>
                    <p className="text-justify italic">"{selectedArticle.excerpt}"</p>
                    <p className="text-justify mt-2">{selectedArticle.content[0] || ""}</p>
                    <div className="p-3 bg-[#121214] border border-white/5 rounded-xl text-center text-cozy-xs text-[#fb923c] font-semibold mt-4">
                      ✦ Clique no botão abaixo para ler o manuscrito completo em sua página de leitura dedicada!
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <Link href={`/blog/${selectedArticle.id}`} className="w-full sm:w-auto">
                      <Button className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold rounded-full text-cozy-xs px-5 py-2">
                        Ler Artigo Completo →
                      </Button>
                    </Link>
                    <Link href="https://catarse.me" target="_blank" className="w-full sm:w-auto">
                      <Button className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold rounded-full text-cozy-xs px-5 py-2">
                        Apoiar no Catarse
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="h-60 flex flex-col items-center justify-center text-[#94a3b8]">
                  <BookOpen className="w-12 h-12 mb-3 text-[#94a3b8]/30" />
                  Selecione um artigo para ler seu conteúdo completo
                </div>
              )}
            </div>

            {/* Default guide if no article selected */}
            {!selectedArticle && (
              <div className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center text-center p-12 bg-[#1c1c22] border border-white/5 border-dashed rounded-[20px] min-h-[300px]">
                <BookOpen className="w-16 h-16 text-[#cd853f] mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-[#f4ebd0]">Tomo Aberto</h3>
                <p className="text-xs text-[#94a3b8] mt-2 max-w-[280px]">
                  Clique em qualquer crônica de desenvolvimento ao lado para abrir e ler os segredos da Biblioteca da 5ª Avenida.
                </p>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#0c0c0e] border-t border-[#5c3a21] py-8 text-center text-xs text-[#94a3b8] mt-12 relative z-10">
        © 2026 Biblioteca da 5ª Avenida RPG. Feito com amor, café e cartas NFC.
      </footer>

    </div>
  );
}
