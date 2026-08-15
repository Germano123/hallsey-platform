"use client";

import React, { useState, useEffect } from "react";
import { BlogService, Article } from "@/lib/services/blog.service";
import { CampaignManager } from "@/components/organisms/campaign-manager";
import { Newspaper, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function UserPortalPage() {
  const blogService = new BlogService();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getArticles().then(list => {
      setArticles(list.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 font-cozy relative z-10 max-w-4xl mx-auto">
      
      {/* Welcome Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#f4ebd0]">Central de Guardiões</h2>
        <p className="text-xs text-[#94a3b8] mt-1">Acompanhe as últimas atualizações da biblioteca e acesse suas campanhas.</p>
      </div>

      {/* News Feeds Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#f4ebd0] uppercase tracking-wider flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#fb923c]" /> Notícias da Biblioteca
        </h3>

        {loading ? (
          <div className="text-xs text-[#94a3b8] p-6 text-center">Carregando crônicas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map(art => (
              <Card 
                key={art.id} 
                onClick={() => setSelectedArticle(art)}
                className="bg-[#1c1c22] border border-white/5 hover:border-[#8b5a2b]/30 p-4 rounded-xl flex flex-col justify-between h-44 cursor-pointer shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-2">
                  <span className="text-[8px] bg-[#fb923c]/15 text-[#fb923c] px-2 py-0.5 rounded-full font-bold uppercase">{art.category}</span>
                  <h4 className="text-[11px] font-bold text-[#f4ebd0] line-clamp-2 leading-tight">{art.title}</h4>
                  <p className="text-[10px] text-[#94a3b8] line-clamp-3 leading-normal">{art.excerpt}</p>
                </div>
                <div className="text-[9px] text-[#fb923c] text-right font-semibold flex items-center justify-end gap-0.5">
                  Ler Mais <ChevronRight className="w-3 h-3" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Campaigns Manager Organism Component */}
      <CampaignManager />

      {/* Modal article reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 font-cozy">
          <div className="bg-[#1c1c22] border border-white/10 border-t-4 border-t-[#8b5a2b] rounded-[20px] max-w-2xl w-full p-6 md:p-8 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:bg-white/10 text-xs px-3 py-1 rounded-full text-[#94a3b8] hover:text-[#f4ebd0]"
            >
              Fechar
            </button>

            <div>
              <span className="text-[9px] bg-[#fb923c]/20 text-[#fb923c] px-2.5 py-1 rounded-full uppercase font-bold">{selectedArticle.category}</span>
              <h3 className="text-xl font-bold text-[#f4ebd0] mt-3">{selectedArticle.title}</h3>
              <p className="text-[10px] text-[#94a3b8] mt-1">Escrito por {selectedArticle.author} em {selectedArticle.date}</p>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 text-xs md:text-sm text-[#94a3b8] leading-relaxed cozy-scroll">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx} className="text-justify">{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
