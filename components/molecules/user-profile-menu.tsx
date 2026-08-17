"use client"

import { ChevronUp, LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth.context"
import { getInitials } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-[#f4ebd0]"
            >
              {
                !user ? (
                  <div className="flex w-full items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="flex flex-1 flex-col gap-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="ml-auto h-4 w-4 rounded-sm" />
                  </div>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="https://placehold.co/32x32" alt="Avatar" />
                      <AvatarFallback className="rounded-lg bg-emerald-600 text-white">
                        {getInitials(user.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-cozy-sm leading-tight text-[#f4ebd0]">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-cozy-xs text-muted-foreground uppercase">
                        {user.role}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto size-4 text-[#94a3b8]" />
                  </>
                )
              }
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#1c1c22] border border-white/5 text-[#f4ebd0]"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => router.push("/perfil")} className="focus:bg-white/5 focus:text-[#f4ebd0] cursor-pointer">
              <User className="mr-2 h-4 w-4 text-[#fb923c]" />
              <span>Ver Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={logout} className="focus:bg-red-950/40 focus:text-red-300 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4 text-red-400" />
              <span>Sair da Conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
