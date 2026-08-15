import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { AuthProvider } from "@/contexts/auth.context";
import { AdminFab } from "@/components/molecules/admin-fab";

const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka"
});

export const metadata: Metadata = {
  title: "Biblioteca da 5ª Avenida - RPG de Mesa",
  description:
    "Financiamento coletivo do novo RPG de mesa fantástico-místico.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fredoka.className} cozy-scroll`}>
      <AuthProvider>
        <body className="min-w-screen min-h-screen w-full h-screen">
          {children}
          <AdminFab />
        </body>
      </AuthProvider>
    </html>
  );
}
