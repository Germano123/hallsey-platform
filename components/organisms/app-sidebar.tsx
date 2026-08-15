"use client";

import type * as React from "react";
import {
  Home,
  Users,
  UserCheck,
  Club,
  BookOpen,
  Compass,
  Newspaper,
  BarChart3,
  User
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/user-profile";
import { useAuth } from "@/contexts/auth.context";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAdmin } = useAuth();

  const navigationItems = [
    {
      title: "Biblioteca (Home)",
      url: "/",
      icon: BookOpen,
    },
    ...(isAdmin ? [
      {
        title: "Painel Admin",
        url: "/dashboard",
        icon: BarChart3,
      }
    ] : [
      {
        title: "Portal do Guardião",
        url: "/portal",
        icon: Compass,
      },
      {
        title: "Minha Ficha NFC",
        url: "/perfil",
        icon: User,
      }
    ]),
    {
      title: "Blog & Notícias",
      url: "/blog",
      icon: Newspaper,
    },
  ];

  const adminItems = isAdmin ? [
    {
      title: "Gerenciar Usuários",
      url: "/usuarios",
      icon: UserCheck,
    },
  ] : [];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Club className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-[#f4ebd0]">
            <span className="truncate font-semibold font-cozy">5ª Avenida RPG</span>
            <span className="truncate text-xs text-muted-foreground">
              {isAdmin ? "Painel de Gestão" : "Área do Jogador"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="font-cozy">
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
