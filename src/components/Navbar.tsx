"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isDashboard =
        pathname.startsWith("/admin") ||
        pathname === "/dosen" ||
        pathname.startsWith("/dosen/") ||
        pathname.startsWith("/gkm") ||
        pathname === "/login";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    if (isDashboard) {
        return null;
    }

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Profil Dosen", href: "/dosen-publik" },
        { name: "Kurikulum", href: "/kurikulum-publik" },
        { name: "Fasilitas & Aktifitas", href: "/galeri" },
        { name: "Penjaminan Mutu", href: "/laporan-mutu" },
    ];

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 backdrop-blur-xl shadow-lg shadow-blue-950/30 border-b border-white/10"
                : "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border-b border-white/10"
                }`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-400/20 group-hover:shadow-lg group-hover:shadow-blue-400/30 transition-all">
                            <img src="/logo.png" alt="TI logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-bold text-lg text-white hidden sm:block tracking-tight">
                            Sarjana Terapan Teknik Informatika
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                        ? "text-white bg-white/15"
                                        : "text-blue-200/80 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-400 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link href="/login" className="hidden md:block">
                            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-md shadow-blue-950/20 hover:shadow-lg transition-all backdrop-blur-sm">
                                Login Portal
                            </Button>
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-xl animate-fade-in">
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <div className="mt-2 pt-3 border-t">
                                <Link href="/login">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                        Login Portal
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}