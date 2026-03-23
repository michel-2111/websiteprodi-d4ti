"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createPenelitian } from "@/src/app/actions/penelitian";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

// Tipe data untuk daftar dosen yang di-passing dari halaman utama
type Dosen = {
    id: string; // ID DosenProfile
    user: { name: string | null };
};

export default function PenelitianForm({ dosenList }: { dosenList: Dosen[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    
    // State untuk menampung ID anggota terpilih
    const [selectedAnggota, setSelectedAnggota] = useState<string[]>([]);

    const handleSubmit = async (formData: FormData) => {
        // Sisipkan data array anggota ke dalam formData sebelum dikirim ke server
        selectedAnggota.forEach(id => {
            formData.append("anggotaIds", id);
        });

        const promise = createPenelitian(formData).then(() => {
            formRef.current?.reset();
            setSelectedAnggota([]); // Kosongkan anggota setelah berhasil
        });

        toast.promise(promise, {
            loading: "Menyimpan data penelitian...",
            success: "Penelitian berhasil ditambahkan!",
            error: (err) => err.message || "Gagal menyimpan penelitian.",
        });
    };

    // Fungsi saat dropdown dipilih
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val && !selectedAnggota.includes(val)) {
            setSelectedAnggota([...selectedAnggota, val]);
        }
        e.target.value = ""; // Kembalikan dropdown ke posisi default
    };

    // Fungsi untuk menghapus anggota dari pilihan
    const removeAnggota = (idToRemove: string) => {
        setSelectedAnggota(selectedAnggota.filter(id => id !== idToRemove));
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
            <h3 className="font-semibold text-lg border-b pb-2">Tambah Penelitian</h3>
            
            <div className="space-y-2">
                <Label htmlFor="judul">Judul Penelitian</Label>
                <Textarea 
                    id="judul" 
                    name="judul" 
                    required 
                    placeholder="Contoh: Pengembangan Sistem Aplikasi Monitoring Tugas Akhir Mahasiswa" 
                    className="h-20" 
                />
            </div>

            {/* ---> BARU: Input Deskripsi <--- */}
            <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Singkat (Abstrak)</Label>
                <Textarea 
                    id="deskripsi" 
                    name="deskripsi" 
                    placeholder="Jelaskan secara singkat tujuan dan hasil penelitian ini..." 
                    className="h-20" 
                />
            </div>

            {/* ---> BARU: Multi-Select Rekan Dosen <--- */}
            <div className="space-y-2 border p-3 rounded-md bg-zinc-50 border-zinc-200 shadow-inner">
                <Label htmlFor="pilihAnggota" className="text-blue-700 font-semibold">Pilih Anggota Peneliti</Label>
                <p className="text-[11px] text-zinc-500 mb-2 leading-tight">Anda otomatis dicatat sebagai Ketua. Pilih rekan dosen yang ikut serta dalam penelitian ini.</p>
                
                <select 
                    id="pilihAnggota" 
                    onChange={handleSelect}
                    className="flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                    <option value="">-- Cari & Tambahkan Anggota --</option>
                    {/* Hanya tampilkan dosen yang belum dipilih */}
                    {dosenList.filter(d => !selectedAnggota.includes(d.id)).map(d => (
                        <option key={d.id} value={d.id}>{d.user.name}</option>
                    ))}
                </select>

                {/* Tampilan Badge (Pill) untuk Anggota Terpilih */}
                {selectedAnggota.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-200">
                        {selectedAnggota.map(id => {
                            const dosen = dosenList.find(d => d.id === id);
                            return (
                                <div key={id} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                    <span>{dosen?.user.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeAnggota(id)}
                                        className="hover:bg-blue-200 hover:text-blue-900 rounded p-0.5 transition-colors ml-1"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tahun">Tahun Pelaksanaan</Label>
                <Input id="tahun" name="tahun" type="number" required min="1990" max="2099" placeholder="2026" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="gambar">Dokumentasi</Label>
                <Input id="gambar" name="gambar" type="file" accept="image/*" multiple />
                <p className="text-xs text-zinc-500">Anda dapat memilih lebih dari satu foto kegiatan.</p>
            </div>
            
            <Button type="submit" className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white">Simpan Penelitian</Button>
        </form>
    );
}