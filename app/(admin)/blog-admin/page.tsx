"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth.context";
import { BlogService, Article } from "@/lib/services/blog.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Newspaper, 
  Plus, 
  Eye, 
  Calendar, 
  FileText, 
  Search, 
  Clock, 
  User, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles
} from "lucide-react";

export default function AdminBlogPage() {
  const { user } = useAuth();
  const blogService = new BlogService();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posted" | "draft" | "scheduled">("posted");
  const [searchQuery, setSearchQuery] = useState("");

  // Post Creator Form State
  const [showForm, setShowForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Desenvolvimento");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postImage, setPostImage] = useState("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop");
  const [postReadTime, setPostReadTime] = useState("4 min");
  const [postContent, setPostContent] = useState("");
  const [postStatus, setPostStatus] = useState<"posted" | "draft" | "scheduled">("posted");
  
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const list = await blogService.getArticles();
      setArticles(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setPublishing(true);

    if (!postTitle || !postExcerpt || !postContent) {
      setErrorMsg("Por favor, preencha o título, resumo e conteúdo do artigo.");
      setPublishing(false);
      return;
    }

    try {
      const paragraphs = postContent.split("\n").filter(line => line.trim() !== "");

      await blogService.addArticle({
        title: postTitle,
        category: postCategory,
        author: user?.name || "Administrador",
        excerpt: postExcerpt,
        image: postImage,
        readTime: postReadTime,
        content: paragraphs,
        status: postStatus,
        views: 0
      });

      setSuccessMsg("Artigo registrado com sucesso!");
      setPostTitle("");
      setPostExcerpt("");
      setPostContent("");
      setShowForm(false);
      loadArticles();
    } catch (err) {
      setErrorMsg("Erro ao salvar o artigo no banco de dados.");
    } finally {
      setPublishing(false);
    }
  };

  // Filtering list by active tab and search query
  const filtered = articles.filter(art => {
    const matchesTab = (art.status || "posted") === activeTab;
    const matchesQuery = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <SidebarInset className="bg-transparent border-none">
      <div className="p-6 md:p-8 font-cozy relative overflow-y-auto max-w-7xl mx-auto space-y-8 w-full">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#f4ebd0]">Gerenciador do Blog</h2>
            <p className="text-cozy-sm text-[#94a3b8] mt-1">Crie, agende, publique e gerencie rascunhos de notícias e crônicas da biblioteca.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="bg-[#202024] border border-zinc-800 hover:bg-[#121214] text-cozy-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 text-[#94a3b8] hover:text-[#f4ebd0] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Painel Admin
            </Link>
            
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold text-cozy-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-[#10b981]/15"
            >
              <Plus className="w-4 h-4" />
              Nova Notícia
            </Button>
          </div>
        </div>

        {/* Blog Post Form drawer-like Card */}
        {showForm && (
          <Card className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-2xl space-y-5 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-[#f4ebd0] flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[#10b981]" />
                Escrever Nova Notícia / Crônica
              </h3>
              <Button 
                onClick={() => setShowForm(false)} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-cozy-xs px-3 h-7 rounded-full text-[#94a3b8] hover:text-[#f4ebd0]"
              >
                Cancelar
              </Button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 text-cozy-xs text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-cozy-xs text-[#94a3b8]">Título do Artigo</Label>
                  <Input 
                    id="title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Ex: Revelada nova Lente do Guardião"
                    className="bg-[#121214] border-white/10 text-[#f4ebd0] h-9 text-cozy-xs rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-cozy-xs text-[#94a3b8]">Categoria</Label>
                    <select
                      id="category"
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-cozy-xs h-9 px-2 focus:outline-none"
                    >
                      <option value="Desenvolvimento">Desenvolvimento</option>
                      <option value="Mecânicas">Mecânicas</option>
                      <option value="Comunidade">Comunidade</option>
                      <option value="Lore & História">Lore & História</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="readtime" className="text-cozy-xs text-[#94a3b8]">Leitura</Label>
                    <Input 
                      id="readtime"
                      value={postReadTime}
                      onChange={(e) => setPostReadTime(e.target.value)}
                      placeholder="Ex: 5 min"
                      className="bg-[#121214] border-white/10 text-[#f4ebd0] h-9 text-cozy-xs rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="status" className="text-cozy-xs text-[#94a3b8]">Status de Publicação</Label>
                    <select
                      id="status"
                      value={postStatus}
                      onChange={(e) => setPostStatus(e.target.value as any)}
                      className="w-full bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-cozy-xs h-9 px-2 focus:outline-none"
                    >
                      <option value="posted">Publicado (Visível no Blog)</option>
                      <option value="draft">Rascunho (Privado/Rascunho)</option>
                      <option value="scheduled">Agendado (Futuro)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="image" className="text-cozy-xs text-[#94a3b8]">URL da Imagem</Label>
                    <Input 
                      id="image"
                      value={postImage}
                      onChange={(e) => setPostImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="bg-[#121214] border-white/10 text-[#f4ebd0] h-9 text-cozy-xs rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="excerpt" className="text-cozy-xs text-[#94a3b8]">Resumo (Excerpt)</Label>
                  <Input 
                    id="excerpt"
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    placeholder="Breve descrição da notícia..."
                    className="bg-[#121214] border-white/10 text-[#f4ebd0] h-9 text-cozy-xs rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Right Column Content Field */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-1 flex-1 flex flex-col">
                  <Label htmlFor="content" className="text-cozy-xs text-[#94a3b8]">Conteúdo (Pule linhas para parágrafos)</Label>
                  <textarea 
                    id="content"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Escreva a crônica de lore ou atualização..."
                    className="w-full flex-1 bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-cozy-xs p-3 focus:outline-none resize-none min-h-[180px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={publishing}
                  className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold text-cozy-xs h-10 rounded-full flex items-center justify-center gap-1.5 mt-2"
                >
                  <FileText className="w-4 h-4" />
                  {publishing ? "Registrando Artigo..." : "Salvar Artigo"}
                </Button>
              </div>

            </form>
          </Card>
        )}

        {/* Tab Selection & Search bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#202024] p-3 rounded-2xl border border-zinc-800">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-[#121214] p-1 rounded-xl border border-zinc-900 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("posted")}
              className={`flex-1 sm:flex-none text-cozy-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "posted" ? "bg-[#f97316] text-[#121214]" : "text-[#94a3b8] hover:text-[#f4ebd0]"
              }`}
            >
              Publicados
            </button>
            <button 
              onClick={() => setActiveTab("draft")}
              className={`flex-1 sm:flex-none text-cozy-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "draft" ? "bg-[#f97316] text-[#121214]" : "text-[#94a3b8] hover:text-[#f4ebd0]"
              }`}
            >
              Rascunhos
            </button>
            <button 
              onClick={() => setActiveTab("scheduled")}
              className={`flex-1 sm:flex-none text-cozy-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === "scheduled" ? "bg-[#f97316] text-[#121214]" : "text-[#94a3b8] hover:text-[#f4ebd0]"
              }`}
            >
              Agendados
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar posts..."
              className="bg-[#121214] border border-zinc-900 rounded-xl text-cozy-xs h-9 pl-9 pr-3 w-full text-[#f4ebd0] focus:outline-none focus:border-[#f97316] placeholder-white/20"
            />
          </div>

        </div>

        {/* Content list Grid */}
        {loading ? (
          <div className="p-12 text-center text-cozy-sm text-[#94a3b8] bg-[#202024] border border-zinc-800 rounded-2xl">
            <div className="w-8 h-8 border-3 border-t-[#f97316] border-[#f97316]/20 rounded-full animate-spin mx-auto mb-3" />
            Buscando crônicas no banco...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-cozy-sm text-[#94a3b8] bg-[#202024] border border-zinc-800 rounded-2xl italic">
            Nenhuma notícia encontrada nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(art => (
              <Card 
                key={art.id} 
                className="bg-[#202024] border border-zinc-800 border-t-4 border-t-[#f97316] p-5 rounded-2xl flex flex-col justify-between shadow-xl gap-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-zinc-800 text-[#fb923c] px-2 py-0.5 rounded-full font-bold uppercase">{art.category}</span>
                    <div className="flex items-center gap-1 text-[10px] text-[#34d399] font-bold">
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                      <span>{art.views || 0} views</span>
                    </div>
                  </div>

                  <h3 className="text-cozy-base font-extrabold text-[#f4ebd0] line-clamp-2 leading-tight">{art.title}</h3>
                  <p className="text-cozy-xs text-[#94a3b8] line-clamp-3 leading-relaxed">{art.excerpt}</p>
                </div>

                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {art.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {art.date}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </SidebarInset>
  );
}
