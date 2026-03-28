"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    const isDashboard =
        pathname.startsWith("/admin") ||
        pathname === "/dosen" ||
        pathname.startsWith("/dosen/") ||
        pathname.startsWith("/gkm") ||
        pathname === "/login";

    if (isDashboard) {
        return null;
    }

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-950 text-zinc-300 py-16 border-t border-zinc-900 mt-auto">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    <div className="md:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/30">
                                <img src="/logo.png" alt="TI logo" className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl leading-tight tracking-tight">D4 Teknik Informatika</h3>
                                <p className="text-sm text-zinc-400 font-medium">Politeknik Negeri Manado</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
                            Menghasilkan lulusan Sarjana Terapan yang unggul, inovatif, dan kompeten di bidang rekayasa perangkat lunak, sistem cerdas, dan jaringan komputer untuk memenuhi tuntutan industri global.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="h-10 w-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white transition-all social-glow">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all social-glow">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all social-glow">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Tautan Publik</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span> Beranda Utama</Link></li>
                            <li><Link href="/visi-misi" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span> Visi & Misi</Link></li>
                            <li><Link href="/dosen-publik" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span> Direktori Pengajar</Link></li>
                            <li><Link href="/kurikulum-publik" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span> Struktur Kurikulum</Link></li>
                            <li><Link href="/galeri" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span> Fasilitas & Tri Dharma</Link></li>
                            {/* <li><Link href="/laporan-mutu" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2"><span className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span> Penjaminan Mutu (GKM)</Link></li> */}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h3>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="h-4 w-4 text-blue-400" />
                                </div>
                                <span className="leading-relaxed">
                                    Kampus Politeknik Negeri Manado<br />
                                    Jl. Raya Politeknik, Buha, Mapanget<br />
                                    Kota Manado, Sulawesi Utara 95252
                                </span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-white transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Phone className="h-4 w-4 text-blue-400" />
                                </div>
                                <span>(0431) 811149</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-white transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Mail className="h-4 w-4 text-blue-400" />
                                </div>
                                <span>info@polimdo.ac.id</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-white transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Globe className="h-4 w-4 text-blue-400" />
                                </div>
                                <span>teknikelektropolimdo.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-zinc-800/80 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
                    <p>&copy; {currentYear} Program Studi D4 Teknik Informatika, Politeknik Negeri Manado.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <Link href="/login" className="hover:text-blue-400 transition-colors">Portal Login (Internal)</Link>
                        <span>•</span>
                        <span>Hak Cipta Dilindungi.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}