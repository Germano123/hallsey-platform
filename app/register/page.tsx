"use client";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Library, Sparkles } from "lucide-react";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;

            if (!name || !email || !password || !confirmPassword) {
                setErrorMsg("Por favor, preencha todos os campos.");
                setLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                setErrorMsg("As senhas não coincidem.");
                setLoading(false);
                return;
            }

            if (password.length < 6) {
                setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
                setLoading(false);
                return;
            }

            const res = await register({
                name,
                email,
                password,
                roles: ["user"]
            });

            if (res && res.uid) {
                router.push("/portal");
            } else {
                setErrorMsg("Não foi possível criar sua conta. Tente novamente.");
            }
        } catch (error) {
            console.error("Registration went wrong: ", error);
            setErrorMsg("Ocorreu um erro no cadastro. Tente outro e-mail.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#121214] text-[#f4ebd0] flex flex-col items-center justify-center p-4 font-cozy relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10b981]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f97316]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="mb-6 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-[#34d399] hover:text-[#10b981] transition-colors mb-2">
                    ← Voltar para a Biblioteca da 5ª Avenida
                </Link>
            </div>

            <Card className="p-8 w-full max-w-[450px] shadow-2xl bg-[#1c1c22] border border-white/5 border-t-4 border-t-[#8b5a2b] rounded-[20px] relative z-10">
                <form onSubmit={handleRegister} className="space-y-4 flex flex-col items-stretch">
                    
                    {/* Logo Section */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-2xl flex items-center justify-center border border-[#34d399]/30 shadow-md">
                            <Sparkles className="w-7 h-7 text-[#f4ebd0]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#f4ebd0]">Iniciar Iniciação</h2>
                            <p className="text-xs text-[#94a3b8] mt-0.5">Registre-se como Guardião na Biblioteca</p>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 text-xs text-center">
                            {errorMsg}
                        </div>
                    )}
            
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-[#f4ebd0] text-xs font-medium">Seu Nome / Codinome</Label>
                        <Input
                            className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] rounded-lg placeholder-[#94a3b8]/40 h-10"
                            type="text"
                            name="name"
                            required
                            placeholder="Alquimista Errante"/>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-[#f4ebd0] text-xs font-medium">E-mail de Guardião</Label>
                        <Input
                            className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] rounded-lg placeholder-[#94a3b8]/40 h-10"
                            type="email"
                            name="email"
                            required
                            placeholder="guardiao@biblioteca.com"/>
                    </div>
                    
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-[#f4ebd0] text-xs font-medium">Escolha uma Senha</Label>
                        <Input
                            className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] rounded-lg placeholder-[#94a3b8]/40 h-10"
                            type="password"
                            name="password"
                            required
                            placeholder="Mínimo 6 caracteres"/>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-[#f4ebd0] text-xs font-medium">Confirme a Senha</Label>
                        <Input
                            className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] rounded-lg placeholder-[#94a3b8]/40 h-10"
                            type="password"
                            name="confirmPassword"
                            required
                            placeholder="Repita sua senha"/>
                    </div>

                    <Button 
                        className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#121214] font-semibold h-11 rounded-[30px] shadow-lg shadow-[#10b981]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mt-2" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Inscrevendo Guardião..." : "Concluir Iniciação"}
                    </Button>
                    
                    <div className="text-center pt-2 border-t border-white/5">
                        <p className="text-xs text-[#94a3b8]">
                            Já é um Guardião?{" "}
                            <Link href="/login" className="text-[#f97316] hover:underline font-medium">
                                Acessar o Portal
                            </Link>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    )
}
