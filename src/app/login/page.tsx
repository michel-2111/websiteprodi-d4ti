"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Loader2, Shield, Code, Database } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("Email atau password tidak valid.");
            setLoading(false);
        } else {
            const session = await getSession();

            if (session?.user?.role === "ADMIN") {
                router.push("/admin");
            } else if (session?.user?.role === "DOSEN") {
                router.push("/dosen");
            } else if (session?.user?.role === "GKM") {
                router.push("/gkm");
            } else {
                router.push("/");
            }
        }
    };

    return (
        <div className="relative flex min-h-screen">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                {/* Dot pattern */}
                <div className="absolute inset-0 dot-pattern opacity-30" />

                {/* Floating orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-soft" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse-soft delay-300" />

                <div className="relative flex flex-col justify-center px-12 xl:px-16 z-10">
                    <div className="mb-10">
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30 mb-6">
                            <img src="/logo.png" alt="TI logo" className="h-full w-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
                            Sistem Informasi<br />
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                D4 Teknik Informatika
                            </span>
                        </h1>
                        <p className="text-blue-200/70 text-lg max-w-md leading-relaxed">
                            Portal manajemen data akademik Program Studi Sarjana Terapan Teknik Informatika, Politeknik Negeri Manado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex flex-col bg-zinc-50">
                {/* Back button */}
                <div className="p-6 md:p-10">
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-500 shadow-sm transition-all hover:text-zinc-900 hover:shadow-md hover:border-zinc-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* Form centered */}
                <div className="flex-1 flex items-center justify-center px-4 pb-12">
                    <div className="w-full max-w-sm">
                        {/* Mobile branding */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20 mx-auto mb-4">
                                TI
                            </div>
                        </div>

                        <Card className="shadow-xl border-zinc-200/50 bg-white">
                            <CardHeader className="space-y-2 text-center pb-2">
                                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                                    Login
                                </CardTitle>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="grid gap-2 pt-2">
                                    {error && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 animate-fade-in">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-zinc-700">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@polimdo.ac.id"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            className="h-11 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-zinc-700">Password</Label>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            className="h-11 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-colors"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="grid gap-4 pt-4">
                                    <Button
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Memverifikasi...
                                            </>
                                        ) : "Login"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>

                        <p className="text-center text-xs text-zinc-400 mt-6">
                            &copy; {new Date().getFullYear()} Politeknik Negeri Manado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}