"use client";

import { useState } from "react";
import Sidebar from "@/src/components/sidebar"; // Pastikan path sesuai huruf besar/kecil file Anda

export default function DashboardClientWrapper({
    userRole,
    userName,
    children,
    }: {
    userRole: string;
    userName: string;
    children: React.ReactNode;
    }) {
    // State untuk mengontrol lebar sidebar dan ruang utama
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-zinc-100/50">
        <Sidebar 
            role={userRole} 
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed} 
        />

        <main className={`flex-1 transition-all duration-300 ease-in-out ${
            isCollapsed ? "pl-20" : "pl-64"
        }`}>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl px-6 shadow-sm">
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Sistem Informasi Prodi</h1>
            <div className="flex items-center gap-3">
                <div className="text-sm text-zinc-500">
                Login sebagai:
                </div>
                <div className="inline-flex items-center gap-2 bg-zinc-100 rounded-full px-3 py-1.5">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {userName.charAt(0)?.toUpperCase() || "U"}
                </div>
                <strong className="text-sm text-zinc-900 font-semibold">{userName}</strong>
                </div>
            </div>
            </header>

            <div className="p-6">
            {children}
            </div>
        </main>
        </div>
    );
}