"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard, BookOpen, Users, Building2, Activity, LogOut, UserCog, TrendingUp, Book, 
    FileText, Search, Award, UserCircle, FileCheck,
    HeartHandshake, Cog, ChevronRight,
    Target, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. IMPORT KOMPONEN SWITCHER
import ProdiSwitcher from "@/src/components/ProdiSwitcher"; 

// 2. INTERFACE PROPS UNTUK SINKRONISASI DENGAN CLIENT WRAPPER
interface SidebarProps {
    role: string;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const menus = {
    ADMIN: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Pengguna", href: "/admin/users", icon: UserCog },
        { name: "Statistik", href: "/admin/statistik", icon: TrendingUp },
        { name: "Kurikulum", href: "/admin/kurikulum", icon: BookOpen },
        { name: "Data Dosen", href: "/admin/data-dosen", icon: Users },
        { name: "Fasilitas", href: "/admin/fasilitas", icon: Building2 },
        { name: "Tri Dharma", href: "/admin/aktifitas", icon: Activity },
        { name: "Dokumen", href: "/admin/dokumen", icon: FileText },
        { name: "Visi Misi", href: "/admin/visi-misi", icon: Target },
        { name: "Pengaturan", href: "/admin/pengaturan", icon: Cog },
        { name: "Alih Jenjang", href: "/admin/alih-jenjang", icon: Users },
    ],
    DOSEN: [
        { name: "Profil Saya", href: "/dosen", icon: UserCircle },
        { name: "Publikasi", href: "/dosen/publikasi", icon: FileText },
        { name: "Penelitian", href: "/dosen/penelitian", icon: Search },
        { name: "Pengabdian", href: "/dosen/pengabdian", icon: HeartHandshake },
        { name: "Buku Ajar", href: "/dosen/buku", icon: BookOpen },
        { name: "HKI", href: "/dosen/hki", icon: Award },
        { name: "Sertifikat", href: "/dosen/sertifikat", icon: FileCheck },
        { name: "Dokumen", href: "/dosen/dokumen", icon: Book },
        { name: "Pengaturan", href: "/dosen/pengaturan", icon: UserCog },
    ],
    GKM: [
        { name: "Dasbor GKM", href: "/gkm", icon: LayoutDashboard },
        { name: "Laporan Mutu", href: "/gkm/laporan", icon: FileCheck },
        { name: "Pengaturan", href: "/gkm/pengaturan", icon: UserCog },
    ]
};

export default function Sidebar({ role, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    const currentMenus = menus[role as keyof typeof menus] || [];

    const roleLabel = role === "ADMIN" ? "Admin Prodi TI" : role === "DOSEN" ? "Portal Dosen" : "Portal GKM";
    const roleColor = role === "ADMIN" ? "from-blue-500 to-indigo-600" : role === "DOSEN" ? "from-emerald-500 to-teal-600" : "from-purple-500 to-violet-600";
    const roleBadgeColor = role === "ADMIN" ? "bg-blue-500/20 text-blue-300" : role === "DOSEN" ? "bg-emerald-500/20 text-emerald-300" : "bg-purple-500/20 text-purple-300";

    return (
        <aside 
            className={`fixed inset-y-0 left-0 z-50 bg-zinc-950 flex flex-col transition-all duration-300 ease-in-out border-r border-zinc-800/50 ${
                isCollapsed ? "w-20" : "w-64"
            }`}
        >
            {/* HEADER SIDEBAR (LOGO & TOGGLE KUSTOM) */}
            <div className={`flex h-16 shrink-0 items-center ${
                isCollapsed ? "justify-center px-0" : "justify-between px-4"
            } border-b border-zinc-800/50`}>
                
                {isCollapsed ? (
                    // TAMPILAN SAAT COLLAPSE: Logo diganti Button Expand tepat di tengah
                    <button 
                        onClick={() => setIsCollapsed(false)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
                        title="Buka Sidebar"
                    >
                        <PanelLeftOpen className="h-5 w-5 animate-in fade-in zoom-in-95 duration-200" />
                    </button>
                ) : (
                    // TAMPILAN NORMAL: Logo TI + Teks Role + Button Collapse
                    <>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-9 w-9 shrink-0 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                TI
                            </div>
                            <div className="whitespace-nowrap transition-opacity duration-300">
                                <span className="font-bold text-sm text-white block leading-tight">
                                    {roleLabel}
                                </span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
                                    {role}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsCollapsed(true)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                            title="Lipat Sidebar"
                        >
                            <PanelLeftClose className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden flex flex-col gap-4 hide-scrollbar">
                
                {role === "ADMIN" && (
                    <div className={`px-3 transition-all duration-300 ${isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
                        <ProdiSwitcher />
                    </div>
                )}

                <div className="px-3">
                    {!isCollapsed && (
                        <p className="mb-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 whitespace-nowrap">
                            Menu Utama
                        </p>
                    )}
                    
                    <div className="space-y-1">
                        {currentMenus.map((item) => {
                            const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/admin" && item.href !== "/dosen" && item.href !== "/gkm");
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={isCollapsed ? item.name : ""}
                                    className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                                    } ${
                                        isActive
                                            ? `bg-linear-to-r ${roleColor} text-white shadow-lg shadow-blue-500/10`
                                            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                                    }`}
                                >
                                    <Icon className="h-4.5 w-4.5 shrink-0" />
                                    
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1 whitespace-nowrap">{item.name}</span>
                                            {isActive && <ChevronRight className="h-4 w-4 opacity-60 shrink-0" />}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Logout */}
            <div className="border-t border-zinc-800/50 p-3">
                <Button
                    variant="ghost"
                    title={isCollapsed ? "Keluar Sistem" : ""}
                    className={`w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${
                        isCollapsed ? "justify-center px-0" : "justify-start"
                    }`}
                    onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}
                >
                    <LogOut className={`${isCollapsed ? "mr-0" : "mr-3"} h-4 w-4 shrink-0`} />
                    {!isCollapsed && <span className="whitespace-nowrap">Keluar Sistem</span>}
                </Button>
            </div>
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </aside>
    );
}