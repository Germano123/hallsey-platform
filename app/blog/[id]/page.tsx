"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BlogService, Article } from "@/lib/services/blog.service";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Heart, 
  Send, 
  Library 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "../../globals.css";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const blogService = new BlogService();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // Likes & comments state
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(24);
  const [comments, setComments] = useState<string[]>([
    "Essa crônica foi essencial para clarear as regras da mesa!",
    "Minha mesa está ansiosa pela revelação física dos tomos."
  ]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (id) {
      blogService.getArticles().then(list => {
        const found = list.find(art => art.id === id);
        if (found) {
          setArticle(found);
          // Set a semi-random likes count based on the id hash code
          const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          setLikesCount(12 + (hash % 45));
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleLike = () => {
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments(prev => [...prev, commentInput]);
    setCommentInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center font-cozy">
        <div className="w-10 h-10 border-4 border-t-[#f97316] border-[#f97316]/20 rounded-full animate-spin mb-3" />
        <p className="text-cozy-sm text-[#94a3b8]">Buscando manuscrito na estante...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center font-cozy p-6">
        <p className="text-cozy-base text-red-400 font-bold mb-4">Crônica não encontrada ou apagada da biblioteca.</p>
        <Button onClick={() => router.push("/blog")} className="bg-[#fb923c] text-[#121214] font-bold rounded-full">
          Voltar ao Acervo
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] text-[#f4ebd0] font-cozy flex flex-col justify-between selection:bg-[#f97316] selection:text-[#121214]">
      
      {/* Header */}
      <header className="bg-[#121214]/90 backdrop-blur-md border-b border-white/5 py-5 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-xl flex items-center justify-center border border-[#cd853f]/30">
            <Library className="w-4 h-4 text-[#f4ebd0]" />
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#f4ebd0] leading-none">Biblioteca da 5ª Avenida</h1>
            <span className="text-[9px] text-[#34d399] tracking-wider uppercase font-semibold">Leitura de Tomo</span>
          </div>
        </div>

        <Link href="/blog" className="inline-flex items-center gap-1.5 text-cozy-xs text-[#94a3b8] hover:text-[#f4ebd0] transition-colors bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Acervo
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full relative z-10">
        
        {/* Banner image */}
        <div 
          className="w-full h-64 md:h-96 rounded-[20px] bg-cover bg-center border border-white/5 shadow-2xl relative mb-8"
          style={{ backgroundImage: `url(${article.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent rounded-[20px]" />
          <span className="absolute top-4 left-4 bg-[#8b5a2b] text-[#f4ebd0] text-cozy-xs font-bold uppercase px-3 py-1 rounded-full border border-[#cd853f]/30 shadow-lg">
            {article.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left/Middle: Post Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#f4ebd0] tracking-tight leading-tight">{article.title}</h2>
              <div className="flex items-center gap-4 text-cozy-xs text-[#94a3b8] mt-3 border-y border-white/5 py-2.5">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Por {article.author}</span>
                <span>Leitura: {article.readTime}</span>
              </div>
            </div>

            <div className="space-y-4 text-cozy-sm md:text-cozy-base text-[#94a3b8] leading-relaxed text-justify">
              {article.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right side: Interactivity Column */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* Interaction Card: Likes */}
            <Card className="bg-[#1c1c22] border border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
              <h4 className="text-cozy-xs text-[#94a3b8] uppercase font-bold tracking-wider border-b border-white/5 pb-2">Interação</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-cozy-sm text-[#f4ebd0] font-bold">{likesCount} curtidas</span>
                <button 
                  onClick={handleLike}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                    liked 
                      ? "bg-red-500/10 border-red-500 text-red-400" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-[#94a3b8] hover:text-[#f4ebd0]"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
                </button>
              </div>
            </Card>

            {/* Interaction Card: Comments */}
            <Card className="bg-[#1c1c22] border border-white/5 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
              <h4 className="text-cozy-xs text-[#94a3b8] uppercase font-bold tracking-wider border-b border-white/5 pb-2">Comentários</h4>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 cozy-scroll text-cozy-xs">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-[#121214] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="font-bold text-[#fb923c] block">Apoiador Guardião</span>
                    <p className="text-[#94a3b8] leading-tight">{comment}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="bg-[#121214] border-white/10 text-cozy-xs h-9 rounded-lg"
                  required
                />
                <Button type="submit" className="bg-[#10b981] hover:bg-[#34d399] text-[#121214] h-9 w-9 p-0 rounded-lg flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </Card>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#0c0c0e] border-t border-[#5c3a21] py-8 text-center text-xs text-[#94a3b8] mt-12 relative z-10">
        © 2026 Biblioteca da 5ª Avenida RPG. Feito com amor, café e cartas NFC.
      </footer>

    </div>
  );
}
