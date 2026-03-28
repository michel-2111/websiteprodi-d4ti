"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileVisiMisiOpen, setMobileVisiMisiOpen] = useState(false);

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

    useEffect(() => {
        setMobileOpen(false);
        setMobileVisiMisiOpen(false);
    }, [pathname]);

    if (isDashboard) return null;

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Profil Dosen", href: "/dosen-publik" },
        { name: "Kurikulum", href: "/kurikulum-publik" },
        { name: "Fasilitas & Tri Dharma", href: "/galeri" },
        // { name: "Penjaminan Mutu", href: "/laporan-mutu" },
    ];

    const visiMisiLinks = [
        { name: "Visi Politeknik Negeri Manado", id: "visi-polimdo" },
        { name: "Misi Politeknik Negeri Manado", id: "misi-polimdo" },
        { name: "Tujuan Politeknik Negeri Manado", id: "tujuan-polimdo" },
        { name: "Visi Prodi D-IV Teknik Informatika", id: "visi-prodi" },
        { name: "Misi Prodi D-IV Teknik Informatika", id: "misi-prodi" },
        { name: "Tujuan Prodi D-IV Teknik Informatika", id: "tujuan-prodi" },
        { name: "Visi Keilmuan Prodi D-IV Teknik Informatika", id: "visi-keilmuan" },
    ];

    const handleScrollTo = (id: string) => {
        setMobileOpen(false);
        if (pathname !== "/visi-misi") {
            router.push(`/visi-misi#${id}`);
        } else {
            const element = document.getElementById(id);
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

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
                        <Link href="/" className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === "/" ? "text-white bg-white/15" : "text-blue-200/80 hover:text-white hover:bg-white/10"}`}>Beranda</Link>
                        
                        {/* Dropdown Visi Misi */}
                        <div className="relative group">
                            <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === "/visi-misi" ? "text-white bg-white/15" : "text-blue-200/80 hover:text-white hover:bg-white/10"}`}>
                                Visi Misi <ChevronDown className="h-4 w-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl shadow-blue-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-zinc-100 py-2 transform origin-top scale-95 group-hover:scale-100">
                                {visiMisiLinks.map((item) => (
                                    <button key={item.id} onClick={() => handleScrollTo(item.id)} className="w-full text-left block px-4 py-2 text-sm text-zinc-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sisa Link */}
                        {navLinks.slice(1).map((link) => (
                            <Link key={link.name} href={link.href} className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === link.href ? "text-white bg-white/15" : "text-blue-200/80 hover:text-white hover:bg-white/10"}`}>
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link href="/login" className="hidden md:block">
                            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-md shadow-blue-950/20 hover:shadow-lg transition-all backdrop-blur-sm">Login Portal</Button>
                        </Link>
                        <button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-xl overflow-y-auto max-h-[80vh]">
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                            <Link href="/" className={`px-4 py-3 rounded-xl text-sm font-medium ${pathname === "/" ? "text-blue-600 bg-blue-50" : "text-zinc-600"}`}>Beranda</Link>
                            
                            {/* Accordion Visi Misi Mobile */}
                            <div>
                                <button onClick={() => setMobileVisiMisiOpen(!mobileVisiMisiOpen)} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-medium ${pathname === "/visi-misi" ? "text-blue-600 bg-blue-50" : "text-zinc-600"}`}>
                                    Visi Misi <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileVisiMisiOpen ? "rotate-180" : ""}`} />
                                </button>
                                {mobileVisiMisiOpen && (
                                    <div className="pl-4 pr-2 py-2 space-y-1 bg-zinc-50 rounded-lg mt-1 border border-zinc-100">
                                        {visiMisiLinks.map((item) => (
                                            <button key={item.id} onClick={() => handleScrollTo(item.id)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-500 hover:text-blue-600 rounded-lg">
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {navLinks.slice(1).map((link) => (
                                <Link key={link.name} href={link.href} className={`px-4 py-3 rounded-xl text-sm font-medium ${pathname === link.href ? "text-blue-600 bg-blue-50" : "text-zinc-600"}`}>{link.name}</Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}