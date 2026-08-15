import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MVP Template - Gestão de Recursos",
  description:
    "Plataforma para gestão de projetos e eventos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <AuthProvider>
        <body className="min-w-screen min-h-screen w-full h-screen">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
