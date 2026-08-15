"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  User, 
  BookOpen, 
  CreditCard, 
  Newspaper, 
  Home, 
  Compass, 
  Sparkles,
  Trophy
} from "lucide-react";

export function RightUserPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [activeCampCount, setActiveCampCount] = useState(2);
  const [favClass, setFavClass] = useState("Arquivista");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCamp = localStorage.getItem("portal-campaigns");
      const storedClass = localStorage.getItem("fav-class");
      
      if (storedCamp) {
        try {
          const list = JSON.parse(storedCamp);
          setActiveCampCount(list.length);
        } catch (e) {}
      }
      if (storedClass) {
        setFavClass(storedClass);
      }
    }
  }, []);

  if (!user) return null;

  const accessRoutes = [
    {
      name: "Início do Portal",
      href: "/portal",
      icon: Compass,
      active: pathname === "/portal"
    },
    {
      name: "Minhas Fichas NFC",
      href: "/portal/fichas",
      icon: CreditCard,
      active: pathname === "/portal/fichas"
    },
    {
      name: "Biblioteca de Tomos",
      href: "/portal/biblioteca",
      icon: BookOpen,
      active: pathname === "/portal/biblioteca"
    },
    {
      name: "Blog & Notícias",
      href: "/blog",
      icon: Newspaper,
      active: pathname === "/blog"
    }
  ];

  return (
    <aside className="w-full lg:w-[20vw] shrink-0 flex flex-col gap-4 font-cozy p-2">
      
      {/* CARD 1: Profile Summary Card */}
      <Card className="bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#fb923c] p-5 rounded-[20px] shadow-xl flex flex-col items-center text-center gap-4">
        
        {/* User Photo */}
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-[#fb923c] rounded-full shadow-lg">
            <AvatarImage src="https://placehold.co/128x128" alt="Foto de Perfil" />
            <AvatarFallback className="bg-emerald-600 text-white text-lg">
              {getInitials(user.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-[#10b981] border-2 border-[#1c1c22] rounded-full" title="Online" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-black text-[#f4ebd0] line-clamp-1">{user.name}</h4>
          <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider block font-semibold">
            {user.role === "admin" ? "Mestre Guardião (Admin)" : `Guardião ${favClass}`}
          </span>
        </div>

        {/* Stats metrics */}
        <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-[10px] text-left">
          <div className="bg-[#121214] p-2 rounded-lg border border-white/5">
            <span className="text-[#94a3b8] block">Campanhas</span>
            <span className="font-bold text-[#f4ebd0] text-sm">{activeCampCount} ativas</span>
          </div>
          <div className="bg-[#121214] p-2 rounded-lg border border-white/5">
            <span className="text-[#94a3b8] block">Status</span>
            <span className="font-bold text-[#34d399] text-[10px] truncate block" title="Apoiador Guardião">Apoiador</span>
          </div>
        </div>

        <Link 
          href="/perfil" 
          className="text-xs text-[#fb923c] hover:text-[#f97316] font-bold hover:underline mt-1 pt-1 flex items-center gap-1"
        >
          Ver perfil completo →
        </Link>
      </Card>

      {/* CARD 2: Routes Access Navigation Card */}
      <Card className="bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#10b981] p-5 rounded-[20px] shadow-xl flex flex-col gap-3">
        <h4 className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-widest border-b border-white/5 pb-2">
          Rotas de Acesso
        </h4>

        <div className="flex flex-col gap-1.5">
          {accessRoutes.map((route, i) => {
            const IconComp = route.icon;
            return (
              <Link 
                key={i}
                href={route.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  route.active 
                    ? "bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/25" 
                    : "text-[#94a3b8] hover:text-[#f4ebd0] hover:bg-white/5 border border-transparent"
                }`}
              >
                <IconComp className={`w-4 h-4 ${route.active ? "text-[#34d399]" : "text-[#94a3b8]"}`} />
                <span>{route.name}</span>
              </Link>
            );
          })}
        </div>
      </Card>
      
    </aside>
  );
}
