"use client";

import React, { useState, FormEvent } from "react";
import { BlogService } from "@/lib/services/blog.service";
import { PlusCircle, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogPostCreatorProps {
  authorName: string;
  onPostCreated?: () => void;
}

export function BlogPostCreator({ authorName, onPostCreated }: BlogPostCreatorProps) {
  const blogService = new BlogService();

  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Desenvolvimento");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postImage, setPostImage] = useState("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop");
  const [postReadTime, setPostReadTime] = useState("4 min");
  const [postContent, setPostContent] = useState("");
  
  const [postPublished, setPostPublished] = useState(false);
  const [postError, setPostError] = useState("");
  const [publishing, setPublishing] = useState(false);

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    setPostError("");
    setPostPublished(false);
    setPublishing(true);

    if (!postTitle || !postExcerpt || !postContent) {
      setPostError("Por favor, preencha o título, resumo e conteúdo do artigo.");
      setPublishing(false);
      return;
    }

    try {
      const paragraphs = postContent.split("\n").filter(line => line.trim() !== "");

      await blogService.addArticle({
        title: postTitle,
        category: postCategory,
        author: authorName,
        excerpt: postExcerpt,
        image: postImage,
        readTime: postReadTime,
        content: paragraphs
      });

      setPostPublished(true);
      setPostTitle("");
      setPostExcerpt("");
      setPostContent("");
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setPostError("Erro ao publicar o artigo no banco de dados.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#10b981] rounded-[20px] p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-[#10b981]" />
        <div>
          <h3 className="text-base font-bold text-[#f4ebd0]">Escrever Notícia / Crônica</h3>
          <p className="text-cozy-xs text-[#94a3b8] mt-0.5">Crie artigos para o blog de desenvolvimento.</p>
        </div>
      </div>

      {postPublished && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-cozy-xs text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> Artigo publicado com sucesso!
        </div>
      )}

      {postError && (
        <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 text-cozy-xs text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> {postError}
        </div>
      )}

      <form onSubmit={handleCreatePost} className="space-y-3.5">
        <div className="space-y-1">
          <Label htmlFor="post-title" className="text-cozy-sm text-[#f4ebd0]">Título do Artigo</Label>
          <Input 
            id="post-title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Ex: Revelada nova Lente do Guardião"
            className="bg-[#121214] border-white/10 text-cozy-sm rounded-lg text-[#f4ebd0] h-9"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="post-category" className="text-cozy-sm text-[#f4ebd0]">Categoria</Label>
            <select
              id="post-category"
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value)}
              className="w-full bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-cozy-sm h-9 px-2 focus:outline-none"
            >
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Mecânicas">Mecânicas</option>
              <option value="Comunidade">Comunidade</option>
              <option value="Lore & História">Lore & História</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="post-readtime" className="text-cozy-sm text-[#f4ebd0]">Leitura</Label>
            <Input 
              id="post-readtime"
              value={postReadTime}
              onChange={(e) => setPostReadTime(e.target.value)}
              placeholder="Ex: 5 min"
              className="bg-[#121214] border-white/10 text-cozy-sm rounded-lg text-[#f4ebd0] h-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="post-excerpt" className="text-cozy-sm text-[#f4ebd0]">Resumo (Excerpt)</Label>
          <Input 
            id="post-excerpt"
            value={postExcerpt}
            onChange={(e) => setPostExcerpt(e.target.value)}
            placeholder="Breve descrição da notícia..."
            className="bg-[#121214] border-white/10 text-cozy-sm rounded-lg text-[#f4ebd0] h-9"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="post-image" className="text-cozy-sm text-[#f4ebd0]">URL da Imagem</Label>
          <Input 
            id="post-image"
            value={postImage}
            onChange={(e) => setPostImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="bg-[#121214] border-white/10 text-cozy-sm rounded-lg text-[#f4ebd0] h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="post-content" className="text-cozy-sm text-[#f4ebd0]">Conteúdo (Pule linhas para parágrafos)</Label>
          <textarea 
            id="post-content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Escreva a crônica de lore ou atualização..."
            rows={5}
            className="w-full bg-[#121214] border border-white/10 rounded-lg text-[#f4ebd0] text-cozy-sm p-3 focus:outline-none resize-none"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={publishing}
          className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-bold text-cozy-sm h-10 rounded-[30px] shadow-lg shadow-[#10b981]/10 flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          {publishing ? "Publicando Artigo..." : "Publicar no Blog"}
        </Button>
      </form>
    </div>
  );
}
