"use client";

import React, { useState, useEffect } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth.context";
import { WishlistService, WishlistEntry } from "@/lib/services/wishlist.service";
import { CrowdfundingService, CrowdfundingMeta } from "@/lib/services/crowdfunding.service";
import { StatCard } from "@/components/molecules/stat-card";
import { BlogPostCreator } from "@/components/organisms/blog-post-creator";
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
  CreditCard, 
  TrendingUp, 
  Sparkles, 
  RefreshCw,
  Sliders,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const wishlistService = new WishlistService();
  const crowdfundingService = new CrowdfundingService();

  const [wishlistData, setWishlistData] = useState<WishlistEntry[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [classStats, setClassStats] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(1284);

  // Crowdfunding Meta state
  const [crowdMeta, setCrowdMeta] = useState<CrowdfundingMeta>({
    currentFunding: 42850,
    targetFunding: 50000,
    backerCount: 432,
    daysRemaining: 18
  });
  const [metaSaving, setMetaSaving] = useState(false);

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
      await crowdfundingService.updateMeta(crowdMeta);
      alert("Metas financeiras salvas com sucesso!");
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

  return (
    <SidebarInset className="bg-transparent border-none">
      <div className="p-6 md:p-8 font-cozy relative overflow-y-auto max-w-7xl mx-auto space-y-8">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#f4ebd0]">Painel de Controle Admin</h2>
            <p className="text-cozy-sm text-[#94a3b8] mt-1">Estatísticas consolidadas de faturamento, usuários cadastrados e gerenciamento de notícias.</p>
          </div>

          <Button 
            onClick={loadData} 
            disabled={dbLoading}
            className="bg-[#1c1c22] border border-white/10 hover:bg-[#121214] text-cozy-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? "animate-spin" : ""}`} />
            Recarregar Dados
          </Button>
        </div>

        {/* 1. Stat cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <StatCard 
            title="Faturamento Total"
            value={`R$ ${crowdMeta.currentFunding.toLocaleString("pt-BR")}`}
            subText={`Meta: R$ ${crowdMeta.targetFunding.toLocaleString("pt-BR")}`}
            icon={Coins}
            iconColorClass="text-[#f97316]"
            borderTopColorClass="border-t-[#f97316]"
          />

          <StatCard 
            title="Usuários Registrados"
            value={wishlistCount}
            subText={`+${wishlistData.length} este mês`}
            icon={Users}
            iconColorClass="text-[#10b981]"
            borderTopColorClass="border-t-[#10b981]"
          />

          <StatCard 
            title="Apoiadores Ativos"
            value={crowdMeta.backerCount}
            subText="Nível de conversão alto"
            icon={Sparkles}
            iconColorClass="text-[#cd853f]"
            borderTopColorClass="border-t-[#cd853f]"
          />

          <StatCard 
            title="Dias Restantes"
            value={`${crowdMeta.daysRemaining} dias`}
            subText="Encerramento de ciclo"
            icon={CreditCard}
            iconColorClass="text-purple-400"
            borderTopColorClass="border-t-purple-500"
            subTextColor="text-purple-400"
          />

        </div>

        {/* 2. Charts and Blog Post Creator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Stats Graphs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart 1: Funding Growth */}
            <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[#f4ebd0] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#fb923c]" /> Histórico de Receitas da Campanha
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
                      contentStyle={{ backgroundColor: "#1c1c22", borderColor: "rgba(255,255,255,0.05)", borderRadius: "8px" }}
                      labelStyle={{ color: "#f4ebd0", fontSize: "11px", fontWeight: "bold" }}
                      itemStyle={{ color: "#fb923c", fontSize: "11px" }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Class popularity */}
            <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-[#f4ebd0] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#34d399]" /> Classes Favoritas da Ficha do Jogador
              </h3>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1c1c22", borderColor: "rgba(255,255,255,0.05)", borderRadius: "8px" }}
                      labelStyle={{ color: "#f4ebd0", fontSize: "11px", fontWeight: "bold" }}
                      itemStyle={{ color: "#34d399", fontSize: "11px" }}
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

          {/* Column 3: BlogPostCreator Form & Support Distribution */}
          <div className="space-y-8">
            <BlogPostCreator authorName={user?.name || "Administrador"} />

            {/* Crowdfunding Meta Editor Form Section */}
            <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-6 shadow-xl space-y-4">
              <h3 className="text-cozy-sm font-bold text-[#f4ebd0] flex items-center gap-2 border-b border-white/5 pb-2">
                <Sliders className="w-4 h-4 text-[#fb923c]" /> Configurações de Metas
              </h3>
              
              <form onSubmit={handleUpdateMeta} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="meta-current" className="text-cozy-xs text-[#94a3b8]">Valor Atual (R$)</Label>
                  <Input 
                    id="meta-current"
                    type="number"
                    value={crowdMeta.currentFunding}
                    onChange={(e) => setCrowdMeta(prev => ({ ...prev, currentFunding: Number(e.target.value) }))}
                    className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="meta-target" className="text-cozy-xs text-[#94a3b8]">Valor Desejado (R$)</Label>
                  <Input 
                    id="meta-target"
                    type="number"
                    value={crowdMeta.targetFunding}
                    onChange={(e) => setCrowdMeta(prev => ({ ...prev, targetFunding: Number(e.target.value) }))}
                    className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="meta-backers" className="text-cozy-xs text-[#94a3b8]">Quantidade de Apoiadores</Label>
                  <Input 
                    id="meta-backers"
                    type="number"
                    value={crowdMeta.backerCount}
                    onChange={(e) => setCrowdMeta(prev => ({ ...prev, backerCount: Number(e.target.value) }))}
                    className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="meta-days" className="text-cozy-xs text-[#94a3b8]">Dias Restantes</Label>
                  <Input 
                    id="meta-days"
                    type="number"
                    value={crowdMeta.daysRemaining}
                    onChange={(e) => setCrowdMeta(prev => ({ ...prev, daysRemaining: Number(e.target.value) }))}
                    className="bg-[#121214] border-white/10 text-cozy-xs rounded-lg text-[#f4ebd0] h-9"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={metaSaving}
                  className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-bold text-cozy-xs h-9 rounded-full mt-2 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar Parâmetros
                </Button>
              </form>
            </div>

            {/* Tiers distribution */}
            <div className="bg-[#1c1c22] border border-white/5 rounded-[20px] p-6 shadow-xl space-y-4">
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
    </SidebarInset>
  );
}
