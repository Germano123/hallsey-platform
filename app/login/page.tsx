"use client";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Library, Flame } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const formData = new FormData(e.currentTarget);
            const credentials = {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
            }
            if (!credentials.email || !credentials.password) {
                setErrorMsg("Por favor, preencha todos os campos.");
                setLoading(false);
                return;
            }
            const res = await login(credentials);
            if (res != null) {
                if (res.role === "admin") {
                    router.push("/dashboard");
                } else {
                    router.push("/portal");
                }
            } else {
                setErrorMsg("E-mail ou senha inválidos.");
            }
        } catch(error) {
            console.log("Login went wrong: ", error);
            setErrorMsg("Ocorreu um erro no login. Verifique seus dados.");
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
                <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-stretch">
                    
                    {/* Logo Section */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#8b5a2b] to-[#5c3a21] rounded-2xl flex items-center justify-center border border-[#cd853f]/30 shadow-md">
                            <Library className="w-8 h-8 text-[#f4ebd0]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-[#f4ebd0]">Portal do Guardião</h2>
                            <p className="text-xs text-[#94a3b8] mt-1">Acesse seus tomos e cartões NFC da Biblioteca</p>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 text-xs text-center">
                            {errorMsg}
                        </div>
                    )}
            
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#f4ebd0] text-sm font-medium">Seu E-mail</Label>
                        <Input
                            className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] rounded-lg placeholder-[#94a3b8]/40 h-11"
                            type="email"
                            name="email"
                            required
                            placeholder="guardiao@biblioteca.com"/>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-[#f4ebd0] text-sm font-medium">Sua Senha</Label>
                        </div>
                        <Input
                            className="bg-[#121214] border-white/10 text-[#f4ebd0] focus-visible:ring-[#10b981] rounded-lg placeholder-[#94a3b8]/40 h-11"
                            type="password"
                            name="password"
                            required
                            placeholder="********"/>
                    </div>

                    <Button 
                        className="w-full bg-[#f97316] hover:bg-[#fb923c] text-[#121214] font-semibold h-11 rounded-[30px] shadow-lg shadow-[#f97316]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Desbloqueando Portal..." : "Entrar no Portal"}
                    </Button>
                    
                    <div className="text-center pt-2 border-t border-white/5">
                        <p className="text-xs text-[#94a3b8]">
                            Ainda não tem conta?{" "}
                            <Link href="/register" className="text-[#34d399] hover:underline font-medium">
                                Criar Conta de Guardião
                            </Link>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    )
}