"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogService, Article } from "@/lib/services/blog.service";
import { CampaignManager } from "@/components/organisms/campaign-manager";
import { Newspaper, ChevronRight, Heart, Send, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { CampaignService, Invitation } from "@/lib/services/campaign.service";
import { CrowdfundingService, CrowdfundingMeta } from "@/lib/services/crowdfunding.service";
import "../../globals.css";

export default function UserPortalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const blogService = new BlogService();
  const campaignService = new CampaignService();
  const crowdfundingService = new CrowdfundingService();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // Crowdfunding configuration state
  const [funding, setFunding] = useState<CrowdfundingMeta>({
    currentFunding: 42850,
    targetFunding: 50000,
    backerCount: 432,
    daysRemaining: 18
  });
  const fundingPercent = Math.round((funding.currentFunding / funding.targetFunding) * 100);

  // Invitations / Notifications state
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Likes & comments state
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({
    "1": { count: 34, liked: false },
    "2": { count: 18, liked: false },
    "3": { count: 52, liked: true },
  });

  const [comments, setComments] = useState<Record<string, string[]>>({
    "1": [
      "Excelente crônica de introdução aos portais do VTT!",
      "Estou ansioso para testar o leitor físico nas mesas de jogo."
    ],
    "2": [
      "Amei as ilustrações do livro das horas perdidas.",
      "As classes parecem estar muito bem balanceadas."
    ],
    "3": [
      "Os bibliófagos parecem inimigos muito originais."
    ]
  });

  const [newComment, setNewComment] = useState("");

  const loadInvitations = useCallback(async () => {
    if (user?.email) {
      try {
        const list = await campaignService.getPendingInvitations(user.email);
        setInvitations(list);
      } catch (err) {
        console.error("Erro ao carregar convites: ", err);
      }
    }
  }, [user?.email]);

  useEffect(() => {
    blogService.getArticles().then(list => {
      setArticles(list.slice(0, 3));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations, refreshCounter]);

  const handleAcceptInvite = async (invId: string, campId: string) => {
    if (!user?.email) return;
    try {
      await campaignService.acceptInvitation(invId, campId, user.email);
      loadInvitations();
      setRefreshCounter(prev => prev + 1);
      alert("Convite aceito com sucesso! Você agora participa desta mesa.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineInvite = async (invId: string, campId: string) => {
    if (!user?.email) return;
    try {
      await campaignService.declineInvitation(invId, campId, user.email);
      loadInvitations();
      setRefreshCounter(prev => prev + 1);
      alert("Convite recusado.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = (artId: string) => {
    setLikes(prev => {
      const current = prev[artId] || { count: 12, liked: false };
      return {
        ...prev,
        [artId]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  const handleAddComment = (e: React.FormEvent, artId: string) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => {
      const list = prev[artId] || [];
      return {
        ...prev,
        [artId]: [...list, newComment]
      };
    });
    setNewComment("");
  };

  return (
    <div className="space-y-8 font-cozy relative z-10 max-w-4xl mx-auto">
      
      {/* Welcome Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#f4ebd0]">Central de Guardiões</h2>
        <p className="text-cozy-sm text-[#94a3b8] mt-1">Acompanhe as últimas atualizações da biblioteca e acesse suas campanhas.</p>
      </div>

      {/* Invitations / Notifications Panel */}
      {invitations.length > 0 && (
        <div className="space-y-3 bg-[#1c1c22] border border-[#10b981]/30 p-5 rounded-[20px] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/5 rounded-full blur-xl pointer-events-none" />
          <h3 className="text-cozy-sm font-extrabold text-[#34d399] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-[#34d399] rounded-full animate-pulse" />
            Novos Convites de RPG
          </h3>
          
          <div className="space-y-2.5 mt-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#121214] border border-white/5 rounded-xl text-cozy-xs">
                <div className="text-[#94a3b8]">
                  Você foi convidado para a campanha <b className="text-[#f4ebd0]">{inv.campaignName}</b> pelo mestre <span className="text-[#fb923c] font-semibold">{inv.mestreEmail}</span>.
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    onClick={() => handleAcceptInvite(inv.id, inv.campaignId)}
                    className="bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold text-cozy-xs h-7 px-3 rounded-full"
                  >
                    Aceitar
                  </Button>
                  <Button 
                    onClick={() => handleDeclineInvite(inv.id, inv.campaignId)}
                    className="bg-red-950/40 border border-red-500/20 hover:bg-red-900/30 text-red-400 font-bold text-cozy-xs h-7 px-3 rounded-full"
                  >
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catarse Crowdfunding Banner */}
      <div className="bg-gradient-to-r from-[#5c3a21]/50 to-[#1c1c22]/90 border border-[#cd853f]/30 rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fb923c]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#f4ebd0] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fb923c] rounded-full animate-ping" />
              Apoie a Campanha no Catarse!
            </h3>
            <p className="text-cozy-xs text-[#94a3b8] leading-relaxed max-w-xl">
              Nossa campanha de financiamento coletivo para o RPG <b>Biblioteca da 5ª Avenida</b> está ativa. Apoie agora para desbloquear metas estendidas e brindes exclusivos de colecionador!
            </p>
          </div>
          
          {/* Progress bar and metrics */}
          <div className="space-y-1.5 max-w-lg">
            <div className="flex justify-between text-cozy-xs text-[#94a3b8]">
              <span>Progresso Financeiro: <b>R$ {funding.currentFunding.toLocaleString("pt-BR")}</b> / R$ {funding.targetFunding.toLocaleString("pt-BR")}</span>
              <span className="font-bold text-[#fb923c]">{fundingPercent}% batido</span>
            </div>
            <div className="w-full bg-[#121214] h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-[#fb923c] h-full rounded-full transition-all duration-1000" style={{ width: `${fundingPercent}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 italic">Atualizado diariamente pela Ordem dos Guardiões.</p>
          </div>
        </div>

        <Link 
          href="https://www.catarse.me" 
          target="_blank"
          className="bg-[#f97316] text-[#121214] hover:bg-[#fb923c] font-black py-3 px-6 rounded-full text-cozy-sm shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0 text-center justify-center"
        >
          Acompanhar no Catarse →
        </Link>
      </div>

      {/* News Feeds Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-cozy-base font-bold text-[#f4ebd0] uppercase tracking-wider flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#fb923c]" /> Notícias da Biblioteca
          </h3>
          <Link href="/blog" className="text-cozy-xs text-[#fb923c] hover:text-[#f97316] font-bold hover:underline">
            Ver mais →
          </Link>
        </div>

        {loading ? (
          <div className="text-cozy-sm text-[#94a3b8] p-6 text-center">Carregando crônicas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map(art => {
              const artId = art.id || "";
              return (
                <Card 
                  key={artId} 
                  onClick={() => setSelectedArticle(art)}
                  className="bg-[#1c1c22] border border-white/5 hover:border-[#8b5a2b]/30 p-5 rounded-xl flex flex-col justify-between min-h-48 cursor-pointer shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="space-y-3">
                    <span className="text-cozy-xs bg-[#fb923c]/15 text-[#fb923c] px-2.5 py-0.5 rounded-full font-bold uppercase">{art.category}</span>
                    <h4 className="text-cozy-sm font-bold text-[#f4ebd0] line-clamp-2 leading-tight">{art.title}</h4>
                    <p className="text-cozy-xs text-[#94a3b8] line-clamp-3 leading-normal">{art.excerpt}</p>
                  </div>
                  <div className="text-cozy-xs text-[#fb923c] text-right font-semibold flex items-center justify-end gap-0.5 mt-5">
                    Ler Mais <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Campaigns Manager Organism Component */}
      <CampaignManager limit={3} key={refreshCounter} />

      {/* Modal article reader with Interaction Section */}
      {selectedArticle && (() => {
        const artId = selectedArticle.id || "";
        const artLikes = likes[artId] || { count: 12, liked: false };
        const artComments = comments[artId] || [];

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 font-cozy">
            <div className="bg-[#1c1c22] border border-white/10 border-t-4 border-t-[#8b5a2b] rounded-[20px] max-w-4xl w-full p-6 md:p-8 shadow-2xl relative">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:bg-white/10 text-cozy-xs px-3 py-1 rounded-full text-[#94a3b8] hover:text-[#f4ebd0] z-20"
              >
                Fechar
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                
                {/* Left/Center Column: News Content */}
                <div className="md:col-span-2 space-y-4 pr-0 md:pr-4">
                  <div>
                    <span className="text-cozy-xs bg-[#fb923c]/20 text-[#fb923c] px-2.5 py-1 rounded-full uppercase font-bold">{selectedArticle.category}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-[#f4ebd0] mt-3 leading-tight">{selectedArticle.title}</h3>
                    <p className="text-cozy-xs text-[#94a3b8] mt-1">Escrito por {selectedArticle.author} em {selectedArticle.date}</p>
                  </div>

                  {/* Reduced article preview scroll (excerpt + first paragraph only) */}
                  <div className="space-y-4 text-cozy-sm text-[#94a3b8] leading-relaxed max-h-[280px] overflow-y-auto pr-2 cozy-scroll text-justify">
                    <p className="font-bold text-[#f4ebd0] mb-1">Resumo da Notícia:</p>
                    <p className="italic">"{selectedArticle.excerpt}"</p>
                    <p className="mt-2">{selectedArticle.content[0] || ""}</p>
                    <div className="p-3 bg-[#121214] border border-white/5 rounded-xl text-center text-cozy-xs text-[#fb923c] font-semibold mt-4">
                      ✦ Clique em "Ler Notícia Inteira" no canto inferior direito para acessar o manuscrito completo em sua página exclusiva!
                    </div>
                  </div>
                </div>

                {/* Right Column: Interaction, Comments & Direct Link */}
                <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between gap-4">
                  
                  {/* Likes Section */}
                  <div className="space-y-2">
                    <h4 className="text-cozy-xs text-[#94a3b8] uppercase font-bold tracking-wider">Curtidas</h4>
                    <div className="flex items-center justify-between bg-[#121214] p-3 rounded-xl border border-white/5">
                      <span className="text-cozy-sm font-bold text-[#f4ebd0]">{artLikes.count} curtidas</span>
                      <button 
                        onClick={() => handleLike(artId)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                          artLikes.liked 
                            ? "bg-red-500/10 border-red-500 text-red-400" 
                            : "bg-white/5 border-white/10 hover:bg-white/10 text-[#94a3b8] hover:text-[#f4ebd0]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${artLikes.liked ? "fill-red-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-2 flex-1 flex flex-col min-h-0">
                    <h4 className="text-cozy-xs text-[#94a3b8] uppercase font-bold tracking-wider">Comentários</h4>
                    
                    {/* List */}
                    <div className="space-y-2 flex-1 max-h-40 overflow-y-auto pr-1 cozy-scroll text-cozy-xs">
                      {artComments.length === 0 ? (
                        <p className="text-[#94a3b8] opacity-60 text-center py-4">Sem comentários ainda.</p>
                      ) : (
                        artComments.map((comment, index) => (
                          <div key={index} className="bg-[#121214] p-2.5 rounded-lg border border-white/5">
                            <span className="font-bold text-[#fb923c] block text-[10px]">Apoiador Guardião</span>
                            <p className="text-[#94a3b8] leading-normal">{comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => handleAddComment(e, artId)} className="flex gap-2 pt-2">
                      <Input 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Comentar..."
                        className="bg-[#121214] border-white/10 text-cozy-xs h-9 rounded-lg"
                        required
                      />
                      <Button type="submit" className="bg-[#10b981] hover:bg-[#34d399] text-[#121214] h-9 w-9 p-0 rounded-lg flex items-center justify-center shrink-0">
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  </div>

                  {/* Action Link to Dedicated Page */}
                  <div className="pt-2 border-t border-white/5">
                    <Button 
                      onClick={() => {
                        setSelectedArticle(null);
                        router.push("/blog/" + artId);
                      }}
                      className="w-full bg-[#8b5a2b] hover:bg-[#cd853f] text-[#f4ebd0] font-bold text-cozy-xs h-10 rounded-full flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      Ler Notícia Inteira
                    </Button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
