"use client";

import React, { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { Users, PlusCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Campaign {
  id: string;
  name: string;
  desc: string;
  mestre: string;
  jogadores: string[];
  convites: string[];
}

export interface CampaignManagerProps {
  limit?: number;
}

export function CampaignManager({ limit }: CampaignManagerProps = {}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp-1",
      name: "A Cripta de Alexandria",
      desc: "Investigando o desaparecimento de tomos do século IV nas profundezas das catacumbas.",
      mestre: "Mestre Germano",
      jogadores: ["bruno@email.com", "ana@email.com"],
      convites: []
    },
    {
      id: "camp-2",
      name: "O Segredo da 5ª Avenida",
      desc: "Sua primeira missão oficial como Guardião no setor central de Nova York.",
      mestre: "Você",
      jogadores: ["carlos@email.com"],
      convites: ["mariana@email.com (Pendente)"]
    }
  ]);

  const [newCampName, setNewCampName] = useState("");
  const [newCampDesc, setNewCampDesc] = useState("");
  const [showCampForm, setShowCampForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [activeInviteCampId, setActiveInviteCampId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portal-campaigns");
      if (stored) {
        try {
          setCampaigns(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleCreateCampaign = (e: FormEvent) => {
    e.preventDefault();
    if (!newCampName) return;

    const newCamp: Campaign = {
      id: "camp-" + Date.now(),
      name: newCampName,
      desc: newCampDesc,
      mestre: "Você",
      jogadores: [],
      convites: []
    };

    const list = [...campaigns, newCamp];
    setCampaigns(list);
    localStorage.setItem("portal-campaigns", JSON.stringify(list));
    
    setNewCampName("");
    setNewCampDesc("");
    setShowCampForm(false);
  };

  const handleSendInvite = (e: FormEvent, campId: string) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const list = campaigns.map(camp => {
      if (camp.id === campId) {
        return {
          ...camp,
          convites: [...camp.convites, `${inviteEmail} (Pendente)`]
        };
      }
      return camp;
    });

    setCampaigns(list);
    localStorage.setItem("portal-campaigns", JSON.stringify(list));
    setInviteEmail("");
    setActiveInviteCampId(null);
  };

  const displayedCampaigns = limit ? campaigns.slice(0, limit) : campaigns;

  return (
    <div className="space-y-5 bg-[#1c1c22]/50 border border-white/5 rounded-2xl p-6 shadow-xl relative z-10 font-cozy">
      
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#34d399]" />
          <div>
            <h3 className="text-base font-bold text-[#f4ebd0]">Minhas Campanhas RPG</h3>
            <p className="text-cozy-xs text-[#94a3b8]">Organize suas mesas de jogo e convide novos jogadores.</p>
          </div>
        </div>

        <Button 
          onClick={() => setShowCampForm(true)}
          className="bg-[#34d399]/15 border border-[#34d399]/30 hover:bg-[#34d399]/20 text-cozy-xs font-bold text-[#34d399] rounded-full px-4 h-8"
        >
          Criar Campanha
        </Button>
      </div>

      {/* Campaign Form - Center Dialog Modal overlay */}
      {showCampForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#1c1c22] border border-white/10 border-t-4 border-t-[#34d399] rounded-[20px] max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowCampForm(false)}
              className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:bg-white/10 text-cozy-xs px-3 py-1 rounded-full text-[#94a3b8] hover:text-[#f4ebd0]"
            >
              Fechar
            </button>
            
            <div>
              <h3 className="text-base font-bold text-[#f4ebd0] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#34d399]" />
                Nova Mesa de RPG
              </h3>
              <p className="text-cozy-xs text-[#94a3b8] mt-0.5">Defina o nome e a sinopse do cenário de sua nova mesa.</p>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="camp-name" className="text-cozy-sm text-[#f4ebd0]">Nome da Campanha</Label>
                <Input 
                  id="camp-name"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="Ex: A Chave Oculta de Boston"
                  className="bg-[#121214] border-white/10 text-cozy-sm rounded-lg text-[#f4ebd0] h-10"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="camp-desc" className="text-cozy-sm text-[#f4ebd0]">Sinopse / Descrição</Label>
                <textarea 
                  id="camp-desc"
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="Breve descrição da aventura..."
                  rows={3}
                  className="w-full bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-cozy-sm p-3 focus:outline-none resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold text-cozy-sm h-10 rounded-full mt-2">
                Salvar Mesa de RPG
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div className="space-y-4">
        {displayedCampaigns.map(camp => (
          <div key={camp.id} className="p-4 bg-[#121214] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-md">
              <Link href={`/portal/campanhas/${camp.id}`} className="hover:underline">
                <h4 className="text-cozy-base font-bold text-[#f4ebd0] hover:text-[#34d399] transition-colors">{camp.name}</h4>
              </Link>
              <p className="text-cozy-sm text-[#94a3b8] leading-normal">{camp.desc}</p>
              <div className="flex gap-4 text-cozy-xs text-[#94a3b8] pt-1">
                <span>Mestre: <b className="text-[#fb923c]">{camp.mestre}</b></span>
                <span>Jogadores: <b>{camp.jogadores.length > 0 ? camp.jogadores.join(", ") : "Nenhum jogador ainda"}</b></span>
              </div>

              {camp.convites.length > 0 && (
                <div className="text-cozy-xs text-[#94a3b8] flex flex-wrap gap-1.5 items-center mt-1">
                  <span>Convites:</span>
                  {camp.convites.map((inv, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-cozy-xs text-[#fb923c]">
                      {inv}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {camp.mestre === "Você" && (
              <div className="shrink-0 flex items-center gap-2">
                {activeInviteCampId === camp.id ? (
                  <form onSubmit={(e) => handleSendInvite(e, camp.id)} className="flex items-center gap-2">
                    <Input 
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Email do jogador"
                      className="bg-[#1c1c22] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-8 w-40"
                      required
                    />
                    <Button type="submit" className="bg-[#fb923c] text-[#121214] rounded-lg w-8 h-8 p-0 flex items-center justify-center" title="Enviar Convite">
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveInviteCampId(null);
                        setInviteEmail("");
                      }}
                      className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/20 hover:bg-red-900/30 text-red-400 flex items-center justify-center shrink-0"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <Button 
                    onClick={() => setActiveInviteCampId(camp.id)}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-cozy-xs font-bold text-[#f4ebd0] rounded-full px-4 h-8"
                  >
                    Convidar Jogador
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button to view all campaigns if limit is set */}
      {limit && campaigns.length > limit && (
        <div className="flex justify-center pt-2 border-t border-white/5">
          <Link href="/portal/campanhas">
            <Button className="bg-[#121214] border border-white/10 hover:bg-[#1c1c22] text-[#f4ebd0] text-cozy-xs font-bold px-6 h-9 rounded-full flex items-center gap-1.5 transition-all">
              Visualizar todas as campanhas <X className="w-3 h-3 rotate-45 text-[#34d399]" />
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}
