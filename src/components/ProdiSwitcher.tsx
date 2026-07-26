"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDaftarProdi, getActiveProdiId, setActiveProdiId } from "@/src/app/actions/prodi-context";
import { GraduationCap, Check, ChevronsUpDown } from "lucide-react";

interface ProdiItem {
    id: string;
    nama: string;
    slug: string;
}

export default function ProdiSwitcher() {
    const [prodis, setProdis] = useState<ProdiItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
        const list = await getDaftarProdi();
        const currentActive = await getActiveProdiId();
        setProdis(list);
        if (currentActive) setActiveId(currentActive);
        }
        loadData();
    }, []);

    const handleSelect = async (id: string) => {
        setActiveId(id);
        setIsOpen(false);
        await setActiveProdiId(id);
        
        // Refresh halaman agar semua Server Component membaca data prodi yang baru
        router.refresh(); 
    };

    const activeProdi = prodis.find((p) => p.id === activeId);

    return (
        <div className="relative w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2 px-2">
            Program Studi
            </label>
            
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 shadow-sm hover:bg-zinc-800 transition-all"
            >
            <div className="flex items-center truncate">
                <GraduationCap className="h-4 w-4 mr-2 text-blue-400 shrink-0" />
                <span className="truncate">{activeProdi ? activeProdi.nama : "Memuat..."}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-zinc-500 shrink-0 ml-2" />
            </button>

            {isOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                {prodis.map((prodi) => (
                <button
                    key={prodi.id}
                    onClick={() => handleSelect(prodi.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-zinc-800 transition-colors ${
                    prodi.id === activeId ? "text-blue-400 font-semibold bg-blue-500/10" : "text-zinc-400"
                    }`}
                >
                    <span className="truncate">{prodi.nama}</span>
                    {prodi.id === activeId && <Check className="h-4 w-4 text-blue-400 shrink-0 ml-2" />}
                </button>
                ))}
            </div>
            )}
        </div>
        );
}