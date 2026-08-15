"use client";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
    const { login, register } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const credentials = {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
            }
            const res = await login(credentials);
            if (res != null) router.push("/dashboard");
        } catch(error) {
            console.log("Login went wrong: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen
        flex items-center justify-center">
            <Card className="p-8 w-[550px]
                shadow-lg
                bg-slate-300">
            <form onSubmit={handleLogin} className="space-y-4 flex flex-col items-center">
                <Card className="w-40 h-40
                    flex items-center justify-center">Logo here</Card>
            
                <div className="grid grid-cols-5 items-center text-end gap-4">
                    <Label htmlFor="email" className="col-span-2">E-mail:</Label>
                    <Input
                        className="col-span-3"
                        type="email"
                        name="email"
                        placeholder="seu-email@email.com"/>
                </div>
                <div className="grid grid-cols-5 items-center text-end gap-4">
                    <Label htmlFor="password" className="col-span-2">Password:</Label>
                    <Input
                        className="col-span-3"
                        type="password"
                        name="password"
                        placeholder="********"/>
                </div>

                <Button className="px-12 min-w-[180px] shadow-md" type="submit">{
                    loading ? "Entrando..." : "Login"
                }</Button>
                {/* <Link href={"/esqueci-a-senha"} >Esqueci a senha</Link> */}
            </form>
        </Card>
        </div>
    )
}