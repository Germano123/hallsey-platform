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
  const [wishlistCount, setWishlistCount] = useState(0);

  // Dynamic statistics counts
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [blogPostsCount, setBlogPostsCount] = useState(0);
  const [blogViewsCount, setBlogViewsCount] = useState(0);

  // Dynamic charts states
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [tierData, setTierData] = useState<any[]>([]);

  // Crowdfunding Meta state
  const [crowdMeta, setCrowdMeta] = useState<CrowdfundingMeta>({
    currentFunding: 0,
    targetFunding: 0,
    backerCount: 0,
    daysRemaining: 0
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);

  // Modal temporary inputs
  const [tempCurrent, setTempCurrent] = useState(0);
  const [tempTarget, setTempTarget] = useState(0);
  const [tempBackers, setTempBackers] = useState(0);
  const [tempDays, setTempDays] = useState(0);

  const loadData = async () => {
    setDbLoading(true);
    try {
      // 1. Load wishlist
      const list = await wishlistService.getWishlist();
      setWishlistData(list);
      setWishlistCount(list.length);

      // 2. Group dynamic class stats
      const counts: Record<string, number> = {
        "Arquivista": 0,
        "Bibliotecário": 0,
        "Encadernador": 0,
        "Tecelão do Verbo": 0
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

      // 3. Group dynamic support tiers based on chosen classes
      const tierCounts = {
        "Iniciado Digital": 0,
        "Guardião Físico": 0,
        "Deluxe NFC": 0
      };

      list.forEach(entry => {
        if (entry.favoriteClass === "Arquivista") {
          tierCounts["Iniciado Digital"]++;
        } else if (entry.favoriteClass === "Bibliotecário" || entry.favoriteClass === "Encadernador") {
          tierCounts["Guardião Físico"]++;
        } else if (entry.favoriteClass === "Tecelão do Verbo") {
          tierCounts["Deluxe NFC"]++;
        } else {
          tierCounts["Iniciado Digital"]++;
        }
      });

      const tiers = [
        { name: "Iniciado Digital", value: tierCounts["Iniciado Digital"], color: "#cd853f" },
        { name: "Guardião Físico", value: tierCounts["Guardião Físico"], color: "#f97316" },
        { name: "Deluxe NFC", value: tierCounts["Deluxe NFC"], color: "#10b981" }
      ];
      setTierData(tiers);

      // 4. Group dynamic user growth history
      const sorted = [...list].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });

      const dailyAdditions: Record<string, number> = {};
      sorted.forEach(entry => {
        if (entry.createdAt) {
          const dateObj = new Date(entry.createdAt);
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const key = `${day}/${month}`;
          dailyAdditions[key] = (dailyAdditions[key] || 0) + 1;
        }
      });

      let currentTotal = 0;
      const chartPoints = [];
      for (const [date, count] of Object.entries(dailyAdditions)) {
        currentTotal += count;
        chartPoints.push({ name: date, valor: currentTotal });
      }

      if (chartPoints.length === 0) {
        setGrowthData([{ name: "Base", valor: 0 }]);
      } else {
        setGrowthData(chartPoints);
      }

      // 5. Load Crowdfunding goals config
      const meta = await crowdfundingService.getMeta();
      setCrowdMeta(meta);
      
      // Sync temporary states
      setTempCurrent(meta.currentFunding);
      setTempTarget(meta.targetFunding);
      setTempBackers(meta.backerCount);
      setTempDays(meta.daysRemaining);

      // 6. Load RPG campaigns count
      const allCamps = await campaignService.getAllCampaigns();
      setCampaignsCount(allCamps.length);

      // 7. Load blog articles stats
      const articles = await blogService.getArticles();
      setBlogPostsCount(articles.length);
      const totalViews = articles.reduce((acc, art) => acc + (art.views || 0), 0);
      setBlogViewsCount(totalViews);

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
      alert("Metas salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações de metas.");
    } finally {
      setMetaSaving(false);
    }
  };

  const fundingPercent = crowdMeta.targetFunding > 0 
    ? Math.round((crowdMeta.currentFunding / crowdMeta.targetFunding) * 100)
    : 0;

  return (
    <SidebarInset className="bg-[#0f0f12] border-none text-zinc-100 min-h-screen">
      <div className="p-6 md:p-8 font-cozy relative overflow-y-auto max-w-7xl mx-auto space-y-8 w-full">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Painel de Controle Admin</h2>
            <p className="text-cozy-sm text-zinc-300 mt-1 font-medium">Estatísticas consolidadas de faturamento, usuários cadastrados e indicadores de jogo.</p>
          </div>

          <Button 
            onClick={loadData} 
            disabled={dbLoading}
            className="bg-[#18181b] border border-zinc-800 hover:bg-[#121214] text-cozy-xs font-extrabold px-5 py-2.5 rounded-full flex items-center gap-2 text-[#fb923c] transition-all hover:scale-105"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${dbLoading ? "animate-spin" : ""}`} />
            Recarregar Dados
          </Button>
        </div>

        {/* 1. Stat cards grid (Includes dynamic variables and high contrast layouts) */}
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
            subText="Guardiões na Newsletter"
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
            value={`${blogViewsCount} views`}
            subText={`Média de ${blogPostsCount > 0 ? Math.round(blogViewsCount / blogPostsCount) : 0} por post`}
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
            
            {/* Chart 1: Funding/User Growth */}
            <div className="bg-[#18181b] border border-zinc-800 border-t-4 border-t-[#f97316] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#f97316]" /> Histórico de Usuários Registrados
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} fontWeight="bold" />
                    <YAxis stroke="#a1a1aa" fontSize={11} fontWeight="bold" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                      labelStyle={{ color: "white", fontSize: "12px", fontWeight: "bold" }}
                      itemStyle={{ color: "#f97316", fontSize: "12px", fontWeight: "bold" }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Class popularity */}
            <div className="bg-[#18181b] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#10b981]" /> Classes Favoritas da Ficha do Jogador
              </h3>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} fontWeight="bold" />
                    <YAxis stroke="#a1a1aa" fontSize={11} fontWeight="bold" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                      labelStyle={{ color: "white", fontSize: "12px", fontWeight: "bold" }}
                      itemStyle={{ color: "#10b981", fontSize: "12px", fontWeight: "bold" }}
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
            <div className="bg-[#18181b] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#10b981]" /> Indicadores das Crônicas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f0f12] p-3.5 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-300 uppercase font-bold block mb-1">Posts Escritos</span>
                  <span className="text-xl font-black text-[#10b981]">{blogPostsCount}</span>
                </div>
                <div className="bg-[#0f0f12] p-3.5 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-300 uppercase font-bold block mb-1">Leituras Totais</span>
                  <span className="text-xl font-black text-[#fb923c]">{blogViewsCount}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-zinc-850">
                <Link
                  href="/blog-admin"
                  className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-extrabold text-cozy-xs h-9 rounded-full flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Gerenciar Artigos
                </Link>
              </div>
            </div>

            {/* KPI 2: Live Catarse Crowdfunding Goals Tracker with Modal Action Button */}
            <div className="bg-[#18181b] border border-zinc-800 border-t-4 border-t-[#f97316] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Sliders className="w-4.5 h-4.5 text-[#f97316]" /> Metas de Financiamento
              </h3>

              <div className="space-y-4">
                {/* Stats */}
                <div className="space-y-2.5 text-cozy-xs text-zinc-200">
                  <div className="flex justify-between items-center">
                    <span>Apoiadores Totais:</span>
                    <span className="font-extrabold text-white">{crowdMeta.backerCount}</span>
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
                    <span className="font-extrabold text-white">R$ {crowdMeta.targetFunding.toLocaleString("pt-BR")}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-zinc-300 font-bold">
                    <span>Arrecadado</span>
                    <span>{fundingPercent}% batido</span>
                  </div>
                  <div className="w-full bg-[#0f0f12] h-2.5 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                    <div className="bg-[#f97316] h-full rounded-full transition-all duration-1000" style={{ width: `${fundingPercent}%` }} />
                  </div>
                </div>

                {/* Trigger Button */}
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-extrabold text-cozy-xs h-9 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-[#f97316]/15 transition-all hover:scale-105"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Atualizar Valores
                </Button>
              </div>
            </div>

            {/* Tiers distribution */}
            <div className="bg-[#18181b] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-white">Apoios por Tiers</h3>
              <div className="h-32 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-cozy-xs">
                {tierData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal configuration settings for goals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-cozy animate-in fade-in duration-200">
          <Card className="bg-[#18181b] border border-zinc-800 border-t-4 border-t-[#f97316] rounded-[20px] max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-[#f97316]" />
                Atualizar Financiamento Catarse
              </h3>
              <p className="text-cozy-xs text-zinc-300 mt-0.5 font-medium">Defina as métricas que serão atualizadas em tempo real nas páginas públicas.</p>
            </div>

            <form onSubmit={handleUpdateMeta} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-current" className="text-cozy-xs text-zinc-200 font-bold">Valor Atual Arrecadado (R$)</Label>
                <Input 
                  id="meta-modal-current"
                  type="number"
                  value={tempCurrent}
                  onChange={(e) => setTempCurrent(Number(e.target.value))}
                  className="bg-[#0f0f12] border-zinc-700 text-cozy-xs rounded-lg text-white h-10 focus-visible:ring-[#f97316]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-target" className="text-cozy-xs text-zinc-200 font-bold">Meta Financeira Desejada (R$)</Label>
                <Input 
                  id="meta-modal-target"
                  type="number"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(Number(e.target.value))}
                  className="bg-[#0f0f12] border-zinc-700 text-cozy-xs rounded-lg text-white h-10 focus-visible:ring-[#f97316]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-backers" className="text-cozy-xs text-zinc-200 font-bold">Total de Apoiadores</Label>
                <Input 
                  id="meta-modal-backers"
                  type="number"
                  value={tempBackers}
                  onChange={(e) => setTempBackers(Number(e.target.value))}
                  className="bg-[#0f0f12] border-zinc-700 text-cozy-xs rounded-lg text-white h-10 focus-visible:ring-[#f97316]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-modal-days" className="text-cozy-xs text-zinc-200 font-bold">Dias Restantes</Label>
                <Input 
                  id="meta-modal-days"
                  type="number"
                  value={tempDays}
                  onChange={(e) => setTempDays(Number(e.target.value))}
                  className="bg-[#0f0f12] border-zinc-700 text-cozy-xs rounded-lg text-white h-10 focus-visible:ring-[#f97316]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-white font-extrabold text-cozy-xs h-9 px-4 rounded-full border border-zinc-850"
                >
                  Fechar
                </Button>
                <Button 
                  type="submit" 
                  disabled={metaSaving}
                  className="bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-black text-cozy-xs h-9 px-5 rounded-full flex items-center gap-1.5"
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
