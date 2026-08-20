"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Crown, 
  FileText, 
  X,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth.context";
import { CampaignService, Campaign } from "@/lib/services/campaign.service";
import "../../../../globals.css";

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const { user } = useAuth();
  const campaignService = new CampaignService();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock campaign immersive logs & shared items
  const [journalLogs, setJournalLogs] = useState<string[]>([
    "Sessão 1: O Encontro na Estante Central — O grupo desvendou as runas antigas nas prateleiras.",
    "Sessão 2: A Sombra da Fera Bibliófaga — Carlos quase perdeu seu grimório no combate do corredor."
  ]);
  
  const [sharedItems, setSharedItems] = useState<string[]>([
    "Grimório Rúnico Incompleto (Item de Missão)",
    "Chave de Metal Antiga (Destranca Setor Sombrio)",
    "Lente de Tradução Mística"
  ]);

  const loadCampaign = useCallback(async () => {
    if (id) {
      setLoading(true);
      try {
        const found = await campaignService.getCampaignById(id);
        setCampaign(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  const handleRemovePlayer = async (playerEmail: string) => {
    if (!campaign) return;
    if (!confirm(`Deseja remover o jogador ${playerEmail} desta campanha?`)) return;

    try {
      await campaignService.removePlayer(campaign.id, playerEmail);
      loadCampaign();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center font-cozy">
        <div className="w-10 h-10 border-4 border-t-[#34d399] border-[#34d399]/20 rounded-full animate-spin mb-3" />
        <p className="text-cozy-sm text-[#94a3b8]">Abrindo crônicas da mesa...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center font-cozy p-6">
        <p className="text-cozy-base text-red-400 font-bold mb-4">Mesa de RPG não encontrada nas crônicas do portal.</p>
        <Button onClick={() => router.push("/portal/campanhas")} className="bg-[#34d399] text-[#121214] font-bold rounded-full">
          Voltar às Campanhas
        </Button>
      </div>
    );
  }

  // Safety/Security Association Check: must be GM or Player
  const isMestre = campaign.mestre === user?.email || campaign.mestre === "Você";
  const isPlayer = campaign.jogadores.includes(user?.email || "");
  const hasAccess = isMestre || isPlayer;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center font-cozy p-6 space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500 animate-bounce" />
        <h3 className="text-xl font-bold text-red-400">Acesso Negado</h3>
        <p className="text-cozy-sm text-[#94a3b8] text-center max-w-sm">
          Você não faz parte desta mesa de RPG e não tem permissão para visualizar suas crônicas.
        </p>
        <Button onClick={() => router.push("/portal")} className="bg-[#fb923c] hover:bg-[#f97316] text-[#121214] font-bold rounded-full px-6 py-2.5">
          Voltar ao Painel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-cozy relative z-10 max-w-4xl mx-auto">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#fb923c]/20 text-[#fb923c] border-none text-[10px] font-bold uppercase py-0.5">
              {isMestre ? "Mestre da Mesa" : "Jogador"}
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#f4ebd0] tracking-tight">{campaign.name}</h2>
          <p className="text-cozy-sm text-[#94a3b8] max-w-2xl leading-relaxed mt-1">
            {campaign.desc}
          </p>
        </div>

        <Link 
          href="/portal/campanhas" 
          className="inline-flex items-center gap-1.5 text-cozy-xs text-[#94a3b8] hover:text-[#f4ebd0] transition-colors bg-white/5 border border-white/10 rounded-full px-4 py-2 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </Link>
      </div>

      {/* Campaign Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Dashboard - Left 2 Columns */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Diary / Journal Section (Mock logs preserved) */}
          <Card className="bg-[#1c1c22] border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
            <h4 className="text-cozy-sm text-[#94a3b8] uppercase font-bold tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#fb923c]" /> Diário de Campanha
            </h4>
            
            <div className="space-y-3">
              {journalLogs.map((log, index) => (
                <div key={index} className="bg-[#121214] p-4 border border-white/5 rounded-xl text-cozy-sm text-[#94a3b8] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </Card>

          {/* Shared Inventory Section */}
          <Card className="bg-[#1c1c22] border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
            <h4 className="text-cozy-sm text-[#94a3b8] uppercase font-bold tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#34d399]" /> Itens e Tomos Compartilhados
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sharedItems.map((item, index) => (
                <div key={index} className="p-3 bg-[#121214] border border-white/5 rounded-xl text-cozy-xs text-[#f4ebd0] flex items-center gap-2 font-semibold">
                  <span className="w-1.5 h-1.5 bg-[#34d399] rounded-full shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Sidebar details - Right 1 Column */}
        <div className="space-y-6">
          
          {/* Members Panel */}
          <Card className="bg-[#1c1c22] border border-white/5 p-5 rounded-2xl space-y-4 shadow-xl">
            <h4 className="text-cozy-xs text-[#94a3b8] uppercase font-bold tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#fb923c]" /> Participantes da Mesa
            </h4>
            
            {/* GM */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Mestre do Jogo</span>
                <div className="flex items-center gap-2.5 bg-[#121214] p-2.5 border border-white/5 rounded-xl">
                  <div className="w-7 h-7 bg-[#8b5a2b] border border-[#cd853f]/30 rounded-full flex items-center justify-center text-[11px] font-bold text-[#f4ebd0]">
                    <Crown className="w-3.5 h-3.5 text-[#fb923c]" />
                  </div>
                  <div>
                    <span className="text-cozy-xs font-bold text-[#f4ebd0] block truncate">{isMestre ? "Você" : campaign.mestre}</span>
                  </div>
                </div>
              </div>

              {/* Active players */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Jogadores</span>
                <div className="space-y-2">
                  {campaign.jogadores.length === 0 ? (
                    <p className="text-cozy-xs text-[#94a3b8] opacity-60 italic text-center py-2 bg-[#121214] rounded-xl border border-white/5">Nenhum jogador na mesa.</p>
                  ) : (
                    campaign.jogadores.map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-[#121214] p-2.5 border border-white/5 rounded-xl text-cozy-xs text-[#94a3b8]">
                        <span className="truncate flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#34d399] rounded-full shrink-0" />
                          <span className="truncate">{player}</span>
                        </span>
                        {isMestre && (
                          <button 
                            onClick={() => handleRemovePlayer(player)}
                            className="text-red-400 hover:text-red-300 p-0.5 rounded transition-colors"
                            title="Remover Jogador"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sent Invites */}
              {campaign.convites.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Convites Enviados</span>
                  <div className="space-y-2">
                    {campaign.convites.map((invite, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-[#121214] p-2.5 border border-white/5 rounded-xl text-cozy-xs text-[#fb923c]">
                        <span className="truncate">{invite}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </Card>

          {/* Quick Stats Panel */}
          <Card className="bg-[#1c1c22] border border-white/5 p-5 rounded-2xl space-y-3 shadow-xl">
            <h4 className="text-cozy-xs text-[#94a3b8] uppercase font-bold tracking-wider border-b border-white/5 pb-2">Status da Aventura</h4>
            <div className="space-y-2 text-cozy-xs">
              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Sessões Jogadas:</span>
                <span className="font-bold text-[#f4ebd0]">2</span>
              </div>
              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Itens Coletados:</span>
                <span className="font-bold text-[#f4ebd0]">{sharedItems.length}</span>
              </div>
              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Fichas Ativas:</span>
                <span className="font-bold text-[#34d399]">{campaign.jogadores.length}</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
