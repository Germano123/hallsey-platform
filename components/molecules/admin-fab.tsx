"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth.context";
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  BookOpen, 
  X 
} from "lucide-react";

export function AdminFab() {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Only display if user is logged in AND is admin
  if (!user || !isAdmin) return null;

  const adminRoutes = [
    {
      name: "Painel Principal",
      href: "/dashboard",
      icon: BarChart3
    },
    {
      name: "Gerenciar Usuários",
      href: "/usuarios",
      icon: Users
    },
    {
      name: "Relatórios",
      href: "/relatorios",
      icon: FileText
    },
    {
      name: "Configurações",
      href: "/configuracoes",
      icon: Settings
    },
    {
      name: "Visualizar Portal",
      href: "/portal",
      icon: BookOpen
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-cozy">
      
      {/* Dynamic Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="px-2.5 py-1.5 border-b border-slate-100 flex justify-between items-center">
            <span className="text-cozy-xs text-slate-500 font-bold uppercase tracking-wider">Gestão do Mestre</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col gap-1">
            {adminRoutes.map((route, i) => {
              const IconComponent = route.icon;
              return (
                <Link 
                  key={i}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-cozy-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  <IconComponent className="w-4 h-4 text-emerald-600" />
                  <span>{route.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) - white background for contrast */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white hover:bg-slate-100 text-[#121214] font-bold border border-slate-200 shadow-2xl rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none"
        title="Painel do Mestre (Admin)"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-800 transition-transform duration-300 rotate-90" />
        ) : (
          <Shield className="w-6 h-6 text-emerald-600 transition-transform duration-300 hover:rotate-12 animate-pulse" />
        )}
      </button>

    </div>
  );
}
