"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createBukuAjar } from "@/src/app/actions/buku";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

type Dosen = {
    id: string;
    user: { name: string | null };
};

export default function BukuForm({ dosenList }: { dosenList: Dosen[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedAnggota, setSelectedAnggota] = useState<string[]>([]);

    const handleSubmit = async (formData: FormData) => {
        selectedAnggota.forEach(id => {
            formData.append("anggotaIds", id);
        });

        const promise = createBukuAjar(formData).then(() => {
            formRef.current?.reset();
            setSelectedAnggota([]);
        });

        toast.promise(promise, {
            loading: "Menyimpan data buku ajar...",
            success: "Buku Ajar berhasil ditambahkan!",
            error: (err) => err.message || "Gagal menyimpan data buku.",
        });
    };

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val && !selectedAnggota.includes(val)) {
            setSelectedAnggota([...selectedAnggota, val]);
        }
        e.target.value = "";
    };

    const removeAnggota = (idToRemove: string) => {
        setSelectedAnggota(selectedAnggota.filter(id => id !== idToRemove));
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
            <h3 className="font-semibold text-lg border-b pb-2">Tambah Buku Ajar</h3>
            
            <div className="space-y-2">
                <Label htmlFor="judul">Judul Buku</Label>
                <Textarea id="judul" name="judul" required placeholder="Contoh: Algoritma dan Pemrograman Dasar" className="h-20" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="deskripsi">Sinopsis / Deskripsi Singkat</Label>
                <Textarea id="deskripsi" name="deskripsi" placeholder="Tuliskan sinopsis singkat mengenai isi buku ini..." className="h-20" />
            </div>

            <div className="space-y-2 border p-3 rounded-md bg-zinc-50 border-zinc-200 shadow-inner">
                <Label htmlFor="pilihAnggota" className="text-indigo-700 font-semibold">Rekan Penulis (Co-Author)</Label>
                <p className="text-[11px] text-zinc-500 mb-2 leading-tight">Anda otomatis dicatat sebagai Penulis Utama. Pilih dosen lain jika ini adalah buku karya bersama.</p>
                
                <select 
                    id="pilihAnggota" 
                    onChange={handleSelect}
                    className="flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                    <option value="">-- Tambah Rekan Penulis --</option>
                    {dosenList.filter(d => !selectedAnggota.includes(d.id)).map(d => (
                        <option key={d.id} value={d.id}>{d.user.name}</option>
                    ))}
                </select>

                {selectedAnggota.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-200">
                        {selectedAnggota.map(id => {
                            const dosen = dosenList.find(d => d.id === id);
                            return (
                                <div key={id} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-xs font-medium border border-indigo-200">
                                    <span>{dosen?.user.name}</span>
                                    <button type="button" onClick={() => removeAnggota(id)} className="hover:bg-indigo-200 rounded ml-1">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tahun">Tahun Terbit</Label>
                    <Input id="tahun" name="tahun" type="number" required placeholder="2026" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="link">Tautan Referensi</Label>
                    <Input id="link" name="link" type="url" placeholder="https://..." />
                </div>
            </div>
            
            <Button type="submit" className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white">Simpan Buku Ajar</Button>
        </form>
    );
}