"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard, BookOpen, Users, Building2, Activity, LogOut, UserCog, TrendingUp,
    FileText, Search, Award, UserCircle, FileCheck,
    HeartHandshake, Cog, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menus = {
    ADMIN: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Pengguna", href: "/admin/users", icon: UserCog },
        { name: "Statistik", href: "/admin/statistik", icon: TrendingUp },
        { name: "Kurikulum", href: "/admin/kurikulum", icon: BookOpen },
        { name: "Data Dosen", href: "/admin/data-dosen", icon: Users },
        { name: "Fasilitas", href: "/admin/fasilitas", icon: Building2 },
        { name: "Aktifitas", href: "/admin/aktifitas", icon: Activity },
        { name: "Pengaturan", href: "/admin/pengaturan", icon: Cog },
    ],
    DOSEN: [
        { name: "Profil Saya", href: "/dosen", icon: UserCircle },
        { name: "Publikasi", href: "/dosen/publikasi", icon: FileText },
        { name: "Penelitian", href: "/dosen/penelitian", icon: Search },
        { name: "Pengabdian", href: "/dosen/pengabdian", icon: HeartHandshake },
        { name: "Sertifikat", href: "/dosen/sertifikat", icon: Award },
        { name: "Pengaturan", href: "/dosen/pengaturan", icon: UserCog },
    ],
    GKM: [
        { name: "Dasbor GKM", href: "/gkm", icon: LayoutDashboard },
        { name: "Laporan Mutu", href: "/gkm/laporan", icon: FileCheck },
        { name: "Pengaturan", href: "/gkm/pengaturan", icon: UserCog },
    ]
};

export default function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();

    const currentMenus = menus[role as keyof typeof menus] || [];

    const roleLabel = role === "ADMIN" ? "Admin Prodi TI" : role === "DOSEN" ? "Portal Dosen" : "Portal GKM";
    const roleColor = role === "ADMIN" ? "from-blue-500 to-indigo-600" : role === "DOSEN" ? "from-emerald-500 to-teal-600" : "from-purple-500 to-violet-600";
    const roleBadgeColor = role === "ADMIN" ? "bg-blue-500/20 text-blue-300" : role === "DOSEN" ? "bg-emerald-500/20 text-emerald-300" : "bg-purple-500/20 text-purple-300";

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 flex flex-col">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 bg-gradient-to-br ${roleColor} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        TI
                    </div>
                    <div>
                        <span className="font-bold text-sm text-white block leading-tight">
                            {roleLabel}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
                            {role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <p className="px-3 mb-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menu Utama</p>
                <div className="space-y-1">
                    {currentMenus.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/admin" && item.href !== "/dosen" && item.href !== "/gkm");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                        ? `bg-gradient-to-r ${roleColor} text-white shadow-lg shadow-blue-500/10`
                                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                                    }`}
                            >
                                <Icon className="h-[18px] w-[18px]" />
                                <span className="flex-1">{item.name}</span>
                                {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout */}
            <div className="border-t border-zinc-800/50 p-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Keluar Sistem
                </Button>
            </div>
        </aside>
    );
}