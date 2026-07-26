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

    // 1. Ekstrak slug prodi dari URL
    const pathSegments = pathname.split("/").filter(Boolean);
    const currentSlug = pathSegments[0] || "";
    const isPortal = pathname === "/"; // Cek apakah user sedang di halaman utama portal

    const isDashboard =
        currentSlug === "admin" ||
        currentSlug === "dosen" ||
        currentSlug === "gkm" ||
        currentSlug === "login";

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

    // 2. Buat Base URL dinamis berdasarkan slug
    const baseUrl = isPortal ? "" : `/${currentSlug}`;

    const navLinks = [
        { name: "Beranda", href: isPortal ? "/" : baseUrl },
        { name: "Profil Dosen", href: `${baseUrl}/dosen-publik` },
        { name: "Kurikulum", href: `${baseUrl}/kurikulum-publik` },
        { name: "Fasilitas & Tri Dharma", href: `${baseUrl}/galeri` },
    ];

    const visiMisiLinks = [
        { name: "Visi Politeknik Negeri Manado", id: "visi-polimdo" },
        { name: "Misi Politeknik Negeri Manado", id: "misi-polimdo" },
        { name: "Tujuan Politeknik Negeri Manado", id: "tujuan-polimdo" },
        { name: "Visi Program Studi", id: "visi-prodi" },
        { name: "Misi Program Studi", id: "misi-prodi" },
        { name: "Tujuan Program Studi", id: "tujuan-prodi" },
        { name: "Visi Keilmuan Program Studi", id: "visi-keilmuan" },
    ];

    const handleScrollTo = (id: string) => {
        setMobileOpen(false);
        // 3. Arahkan scroll dengan URL yang sudah diinjeksi slug
        if (pathname !== `${baseUrl}/visi-misi`) {
            router.push(`${baseUrl}/visi-misi#${id}`);
        } else {
            const element = document.getElementById(id);
            if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const formatNamaProdi = (slug: string) => {
        if (!slug) return "";
        return slug.split('-').map(word => {
            if (word.length <= 2) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    };

    // 3. Fungsi Pemetaan Warna Header Sesuai Gambar Komponen Pilihan
    const getNavbarHeaderStyles = () => {
        // Jika berada di Halaman Portal Utama, gunakan warna bawaan (Gelap)
        if (isPortal) {
            return scrolled
                ? "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 backdrop-blur-xl shadow-lg shadow-blue-950/30"
                : "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950";
        }

        // Hijau Teal untuk Teknik Komputer
        if (currentSlug.includes("teknik-komputer")) {
            return scrolled
                ? "bg-gradient-to-r from-teal-900 via-emerald-950 to-teal-950 backdrop-blur-xl shadow-lg shadow-teal-950/30"
                : "bg-gradient-to-r from-teal-800 via-emerald-900 to-teal-900";
        }

        // Biru untuk Teknik Informatika
        if (currentSlug.includes("ti")) {
            return scrolled
                ? "bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-950 backdrop-blur-xl shadow-lg shadow-blue-950/30"
                : "bg-gradient-to-r from-blue-800 via-indigo-900 to-blue-900";
        }

        // Jingga Karamel/Amber untuk Teknik Listrik
        if (currentSlug.includes("teknik-listrik")) {
            return scrolled
                ? "bg-gradient-to-r from-amber-900 via-orange-950 to-amber-950 backdrop-blur-xl shadow-lg shadow-orange-950/30"
                : "bg-gradient-to-r from-amber-800 via-orange-900 to-amber-900";
        }

        // Fallback jika ada prodi lain yang belum terpetakan
        return scrolled
            ? "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 backdrop-blur-xl shadow-lg shadow-blue-950/30"
            : "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950";
    };
    
    return (
        <>
            {/* 4. Suntikkan fungsi pemetaan warna ke dalam className header */}
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-white/10 ${getNavbarHeaderStyles()}`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href={isPortal ? "/" : baseUrl} className="flex items-center gap-3 group">
                        <div className="relative h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-400/20 group-hover:shadow-lg group-hover:shadow-blue-400/30 transition-all">
                            <img src="/logo.png" alt="TI logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-bold text-lg text-white hidden sm:block tracking-tight">
                            {isPortal ? "Portal Jurusan Teknik Elektro" : "Program Studi " + formatNamaProdi(currentSlug)}
                        </span>
                    </Link>

                    {/* Desktop Nav - Hanya muncul jika BUKAN di Halaman Portal Utama */}
                    {!isPortal && (
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href={navLinks[0].href} className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === navLinks[0].href || pathname === `/${currentSlug}` ? "text-white bg-white/15" : "text-blue-200/80 hover:text-white hover:bg-white/10"}`}>
                                Beranda
                            </Link>
                            
                            {/* Dropdown Visi Misi */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === `${baseUrl}/visi-misi` ? "text-white bg-white/15" : "text-blue-200/80 hover:text-white hover:bg-white/10"}`}>
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
                    )}

                    <div className="flex items-center gap-3">
                        <Link href="/login" className="hidden md:block">
                            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-md shadow-blue-950/20 hover:shadow-lg transition-all backdrop-blur-sm">Login Portal</Button>
                        </Link>
                        
                        {/* Tombol Hamburger Mobile - Hanya muncul jika BUKAN di Halaman Portal Utama */}
                        {!isPortal && (
                            <button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Hanya aktif jika BUKAN di Halaman Portal Utama */}
            {!isPortal && mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-xl overflow-y-auto max-h-[80vh]">
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                            <Link href={navLinks[0].href} className={`px-4 py-3 rounded-xl text-sm font-medium ${pathname === navLinks[0].href || pathname === `/${currentSlug}` ? "text-blue-600 bg-blue-50" : "text-zinc-600"}`}>Beranda</Link>
                            
                            {/* Accordion Visi Misi Mobile */}
                            <div>
                                <button onClick={() => setMobileVisiMisiOpen(!mobileVisiMisiOpen)} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-medium ${pathname === `${baseUrl}/visi-misi` ? "text-blue-600 bg-blue-50" : "text-zinc-600"}`}>
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