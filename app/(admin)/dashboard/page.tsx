"use client";

import React, { useState, useEffect } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth.context";
import { WishlistService, WishlistEntry } from "@/lib/services/wishlist.service";
import { CrowdfundingService, CrowdfundingMeta } from "@/lib/services/crowdfunding.service";
import { CampaignService } from "@/lib/services/campaign.service";
import { BlogService } from "@/lib/services/blog.service";
import { StatCard } from "@/components/molecules/stat-card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  Coins, 
  Sparkles, 
  TrendingUp, 
  RefreshCw,
  Sliders,
  Save,
  BookOpen,
  Eye,
  FileText,
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const wishlistService = new WishlistService();
  const crowdfundingService = new CrowdfundingService();
  const campaignService = new CampaignService();
  const blogService = new BlogService();

  const [wishlistData, setWishlistData] = useState<WishlistEntry[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [classStats, setClassStats] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(1284);

  // Dynamic statistics counts
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [blogPostsCount, setBlogPostsCount] = useState(0);
  const [blogViewsCount, setBlogViewsCount] = useState(0);

  // Crowdfunding Meta state
  const [crowdMeta, setCrowdMeta] = useState<CrowdfundingMeta>({
    currentFunding: 42850,
    targetFunding: 50000,
    backerCount: 432,
    daysRemaining: 18
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);

  // Modal temporary inputs
  const [tempCurrent, setTempCurrent] = useState(42850);
  const [tempTarget, setTempTarget] = useState(50000);
  const [tempBackers, setTempBackers] = useState(432);
  const [tempDays, setTempDays] = useState(18);

  const loadData = async () => {
    setDbLoading(true);
    try {
      // Load wishlist
      const list = await wishlistService.getWishlist();
      setWishlistData(list);
      setWishlistCount(1284 + list.length);

      // Load Crowdfunding goals config
      const meta = await crowdfundingService.getMeta();
      setCrowdMeta(meta);
      
      // Sync temporary states
      setTempCurrent(meta.currentFunding);
      setTempTarget(meta.targetFunding);
      setTempBackers(meta.backerCount);
      setTempDays(meta.daysRemaining);

      // Load RPG campaigns count
      const allCamps = await campaignService.getAllCampaigns();
      setCampaignsCount(allCamps.length);

      // Load blog articles stats
      const articles = await blogService.getArticles();
      setBlogPostsCount(articles.length);
      const totalViews = articles.reduce((acc, art) => acc + (art.views || 0), 0);
      setBlogViewsCount(totalViews);

      // Class distribution initial statistics
      const counts: Record<string, number> = {
        "Arquivista": 348,
        "Bibliotecário": 294,
        "Encadernador": 412,
        "Tecelão do Verbo": 230
      };

      list.forEach(entry => {
        const cls = entry.favoriteClass || "Arquivista";
        if (counts[cls] !== undefined) {
          counts[cls]++;
        }
      });

      const stats = Object.entries(counts).map(([name, count]) => ({
        name,
        count
      }));
      setClassStats(stats);
    } catch (e) {
      console.error(e);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    setMetaSaving(true);
    try {
      const updatedMeta = {
        currentFunding: tempCurrent,
        targetFunding: tempTarget,
        backerCount: tempBackers,
        daysRemaining: tempDays
      };
      await crowdfundingService.updateMeta(updatedMeta);
      setCrowdMeta(updatedMeta);
      setIsModalOpen(false);
      alert("Metas de crowdfunding salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações de metas.");
    } finally {
      setMetaSaving(false);
    }
  };

  // Mock chart details
  const fundingGrowthData = [
    { day: "Dia 1", valor: 12000 },
    { day: "Dia 3", valor: 18500 },
    { day: "Dia 5", valor: 25400 },
    { day: "Dia 7", valor: 31000 },
    { day: "Dia 9", valor: 36800 },
    { day: "Dia 11", valor: 40500 },
    { day: "Dia 13", valor: 42850 }
  ];

  const tierDistributionData = [
    { name: "Iniciado Digital", value: 182, color: "#cd853f" },
    { name: "Guardião Físico", value: 198, color: "#f97316" },
    { name: "Deluxe NFC", value: 52, color: "#10b981" }
  ];

  const fundingPercent = Math.round((crowdMeta.currentFunding / crowdMeta.targetFunding) * 100);

  return (
    <SidebarInset className="bg-transparent border-none">
      <div className="p-6 md:p-8 font-cozy relative overflow-y-auto max-w-7xl mx-auto space-y-8 w-full">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#f4ebd0]">Painel de Controle Admin</h2>
            <p className="text-cozy-sm text-[#94a3b8] mt-1">Estatísticas consolidadas de faturamento, usuários cadastrados e indicadores de jogo.</p>
          </div>

          <Button 
            onClick={loadData} 
            disabled={dbLoading}
            className="bg-[#202024] border border-zinc-800 hover:bg-[#121214] text-cozy-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 text-[#fb923c]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? "animate-spin" : ""}`} />
            Recarregar Dados
          </Button>
        </div>

        {/* 1. Stat cards grid (Includes new Campaigns and Blog KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <StatCard 
            title="Arrecadação Catarse"
            value={`R$ ${crowdMeta.currentFunding.toLocaleString("pt-BR")}`}
            subText={`Meta: R$ ${crowdMeta.targetFunding.toLocaleString("pt-BR")}`}
            icon={Coins}
            iconColorClass="text-[#f97316]"
            borderTopColorClass="border-t-[#f97316]"
          />

          <StatCard 
            title="Usuários Registrados"
            value={wishlistCount}
            subText={`Sincronizado da Newsletter`}
            icon={Users}
            iconColorClass="text-[#10b981]"
            borderTopColorClass="border-t-[#10b981]"
          />

          <StatCard 
            title="Mesa de RPG Criadas"
            value={campaignsCount}
            subText="Campanhas ativas no portal"
            icon={BookOpen}
            iconColorClass="text-purple-400"
            borderTopColorClass="border-t-purple-500"
            subTextColor="text-purple-400"
          />

          <StatCard 
            title="Leituras do Blog"
            value={`${blogViewsCount} visualizações`}
            subText={`Média de ${Math.round(blogViewsCount / (blogPostsCount || 1))} por post`}
            icon={Eye}
            iconColorClass="text-cyan-400"
            borderTopColorClass="border-t-cyan-500"
            subTextColor="text-cyan-400"
          />

        </div>

        {/* 2. Charts and Side Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Stats Graphs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart 1: Funding Growth */}
            <div className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#f97316] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[#f4ebd0] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#f97316]" /> Histórico de Receitas da Campanha
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fundingGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#202024", borderColor: "#27272a", borderRadius: "8px" }}
                      labelStyle={{ color: "#f4ebd0", fontSize: "11px", fontWeight: "bold" }}
                      itemStyle={{ color: "#f97316", fontSize: "11px" }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Class popularity */}
            <div className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[#f4ebd0] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#10b981]" /> Classes Favoritas da Ficha do Jogador
              </h3>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#202024", borderColor: "#27272a", borderRadius: "8px" }}
                      labelStyle={{ color: "#f4ebd0", fontSize: "11px", fontWeight: "bold" }}
                      itemStyle={{ color: "#10b981", fontSize: "11px" }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]}>
                      {classStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#10b981" : "#f97316"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Column 3: News KPIs, Campaign Status tracker & Action Modal Trigger */}
          <div className="space-y-8">
            
            {/* KPI 1: Blog & News Detailed Stats */}
            <div className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-[#f4ebd0] flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#10b981]" /> Indicadores das Crônicas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121214] p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-[#94a3b8] uppercase font-bold block mb-1">Posts Escritos</span>
                  <span className="text-xl font-black text-[#10b981]">{blogPostsCount}</span>
                </div>
                <div className="bg-[#121214] p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-[#94a3b8] uppercase font-bold block mb-1">Leituras Totais</span>
                  <span className="text-xl font-black text-[#fb923c]">{blogViewsCount}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-zinc-850">
                <Link 
                  href="/blog-admin"
                  className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold text-cozy-xs h-9 rounded-full flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Gerenciar Artigos
                </Link>
              </div>
            </div>

            {/* KPI 2: Live Catarse Crowdfunding Goals Tracker with Modal Action Button */}
            <div className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#f97316] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-[#f4ebd0] flex items-center gap-2 border-b border-zinc-850 pb-2">
                <Sliders className="w-4.5 h-4.5 text-[#f97316]" /> Metas de Financiamento
              </h3>

              <div className="space-y-4">
                {/* Stats */}
                <div className="space-y-2.5 text-cozy-xs text-[#94a3b8]">
                  <div className="flex justify-between items-center">
                    <span>Apoiadores Totais:</span>
                    <span className="font-extrabold text-[#f4ebd0]">{crowdMeta.backerCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dias Restantes:</span>
                    <span className="font-extrabold text-[#f97316]">{crowdMeta.daysRemaining} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Progresso Atual:</span>
                    <span className="font-extrabold text-[#10b981]">R$ {crowdMeta.currentFunding.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Meta Final:</span>
                    <span className="font-extrabold text-[#f4ebd0]">R$ {crowdMeta.targetFunding.toLocaleString("pt-BR")}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>Arrecadado</span>
                    <span>{fundingPercent}% batido</span>
                  </div>
                  <div className="w-full bg-[#121214] h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div className="bg-[#f97316] h-full rounded-full transition-all duration-1000" style={{ width: `${fundingPercent}%` }} />
                  </div>
                </div>

                {/* Trigger Button */}
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-black text-cozy-xs h-9 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-[#f97316]/15"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Atualizar Valores
                </Button>
              </div>
            </div>

            {/* Tiers distribution */}
            <div className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-[#f4ebd0]">Apoios por Tiers</h3>
              <div className="h-32 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {tierDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-cozy-xs">
                {tierDistributionData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[#94a3b8]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-[#f4ebd0]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal configuration settings for goals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-cozy animate-in fade-in duration-200">
          <Card className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#f97316] rounded-[20px] max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#f4ebd0] bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-[#f4ebd0] flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-[#f97316]" />
                Atualizar Financiamento Catarse
              </h3>
              <p className="text-cozy-xs text-[#94a3b8] mt-0.5">Defina as métricas que serão atualizadas em tempo real nas páginas públicas.</p>
            </div>

            <form onSubmit={handleUpdateMeta} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-current" className="text-cozy-xs text-[#94a3b8] font-bold">Valor Atual Arrecadado (R$)</Label>
                <Input 
                  id="meta-modal-current"
                  type="number"
                  value={tempCurrent}
                  onChange={(e) => setTempCurrent(Number(e.target.value))}
                  className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-target" className="text-cozy-xs text-[#94a3b8] font-bold">Meta Financeira Desejada (R$)</Label>
                <Input 
                  id="meta-modal-target"
                  type="number"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(Number(e.target.value))}
                  className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-backers" className="text-cozy-xs text-[#94a3b8] font-bold">Total de Apoiadores</Label>
                <Input 
                  id="meta-modal-backers"
                  type="number"
                  value={tempBackers}
                  onChange={(e) => setTempBackers(Number(e.target.value))}
                  className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-days" className="text-cozy-xs text-[#94a3b8] font-bold">Dias Restantes</Label>
                <Input 
                  id="meta-modal-days"
                  type="number"
                  value={tempDays}
                  onChange={(e) => setTempDays(Number(e.target.value))}
                  className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-10"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-850">
                <Button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold text-cozy-xs h-9 px-4 rounded-full border border-white/10"
                >
                  Fechar
                </Button>
                <Button 
                  type="submit" 
                  disabled={metaSaving}
                  className="bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-black text-cozy-xs h-9 px-4 rounded-full flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </SidebarInset>
  );
}
