"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createHki } from "@/src/app/actions/hki";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

type Dosen = {
    id: string;
    user: { name: string | null };
};

export default function HkiForm({ dosenList }: { dosenList: Dosen[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedAnggota, setSelectedAnggota] = useState<string[]>([]);

    const handleSubmit = async (formData: FormData) => {
        selectedAnggota.forEach(id => {
            formData.append("anggotaIds", id);
        });

        const promise = createHki(formData).then(() => {
            formRef.current?.reset();
            setSelectedAnggota([]);
        });

        toast.promise(promise, {
            loading: "Menyimpan data HKI...",
            success: "Data HKI berhasil ditambahkan!",
            error: (err) => err.message || "Gagal menyimpan data HKI.",
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
            <h3 className="font-semibold text-lg border-b pb-2">Tambah Data HKI</h3>
            
            <div className="space-y-2">
                <Label htmlFor="kategori">Kategori HKI</Label>
                <select 
                    id="kategori" 
                    name="kategori"
                    required
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                >
                    <option value="">-- Pilih Kategori --</option>
                    <option value="Merek">Merek</option>
                    <option value="Paten">Paten</option>
                    <option value="Paten Sederhana">Paten Sederhana</option>
                    <option value="Desain Industri">Desain Industri</option>
                    <option value="Hak Cipta">Hak Cipta</option>
                    <option value="Indikasi Geografis">Indikasi Geografis</option>
                    <option value="DTLST">DTLST</option>
                    <option value="Rahasia Dagang">Rahasia Dagang</option>
                    <option value="K.I. Komunal">K.I. Komunal</option>
                    <option value="Penegakan Hukum">Penegakan Hukum</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="judul">Judul / Nama Ciptaan</Label>
                <Textarea id="judul" name="judul" required placeholder="Contoh: Sistem Informasi Manajemen Cerdas Berbasis IoT..." className="h-20" />
            </div>

            <div className="space-y-2 border p-3 rounded-md bg-zinc-50 border-zinc-200 shadow-inner">
                <Label htmlFor="pilihAnggota" className="text-rose-700 font-semibold">Tim Inventor (Opsional)</Label>
                <p className="text-[11px] text-zinc-500 mb-2 leading-tight">Biarkan kosong jika ini karya mandiri. Anda otomatis dicatat sebagai Inventor Utama.</p>
                
                <select 
                    id="pilihAnggota" 
                    onChange={handleSelect}
                    className="flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                >
                    <option value="">-- Tambah Rekan Inventor --</option>
                    {dosenList.filter(d => !selectedAnggota.includes(d.id)).map(d => (
                        <option key={d.id} value={d.id}>{d.user.name}</option>
                    ))}
                </select>

                {selectedAnggota.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-200">
                        {selectedAnggota.map(id => {
                            const dosen = dosenList.find(d => d.id === id);
                            return (
                                <div key={id} className="flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-1 rounded-md text-xs font-medium border border-rose-200">
                                    <span>{dosen?.user.name}</span>
                                    <button type="button" onClick={() => removeAnggota(id)} className="hover:bg-rose-200 rounded ml-1">
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
                    <Label htmlFor="tahun">Tahun (Opsional)</Label>
                    <Input id="tahun" name="tahun" type="number" placeholder="2026" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="link">Tautan (Opsional)</Label>
                    <Input id="link" name="link" type="url" placeholder="https://pdki..." />
                </div>
            </div>
            
            <Button type="submit" className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white">Simpan Data HKI</Button>
        </form>
    );
}