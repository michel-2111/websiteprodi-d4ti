"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { upsertProfilDosen } from "@/src/app/actions/dosen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilForm({ profilInfo }: { profilInfo: any }) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        toast.promise(upsertProfilDosen(formData), {
            loading: "Menyimpan profil...",
            success: "Profil berhasil diperbarui!",
            error: "Gagal menyimpan profil. Pastikan data valid.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nidn">Nomor Induk Dosen Nasional (NIDN)</Label>
                    <Input 
                        id="nidn" 
                        name="nidn" 
                        required 
                        defaultValue={profilInfo?.nidn || ""} 
                        placeholder="Contoh: 0011223344" 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Publik</Label>
                    <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        defaultValue={profilInfo?.email || ""} 
                        placeholder="email.dosen@polimdo.ac.id" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="telepon">Nomor Telepon / WhatsApp</Label>
                    <Input 
                        id="telepon" 
                        name="telepon" 
                        type="tel"
                        defaultValue={profilInfo?.telepon || ""} 
                        placeholder="081234567890" 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jabatanFungsional">Jabatan Fungsional</Label>
                    <select 
                        id="jabatanFungsional" 
                        name="jabatanFungsional"
                        defaultValue={profilInfo?.jabatanFungsional || ""}
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                        <option value="">-- Pilih Jabatan Fungsional --</option>
                        <option value="TENAGA_PENGAJAR">Tenaga Pengajar</option>
                        <option value="ASISTEN_AHLI">Asisten Ahli</option>
                        <option value="LEKTOR">Lektor</option>
                        <option value="LEKTOR_KEPALA">Lektor Kepala</option>
                        <option value="GURU_BESAR">Guru Besar</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="pangkat">Pangkat / Golongan Ruang</Label>
                <select 
                    id="pangkat" 
                    name="pangkat"
                    defaultValue={profilInfo?.pangkat || ""}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                    <option value="">-- Pilih Pangkat & Golongan --</option>
                    <option value="PENATA_MUDA_IIIA">Penata Muda (III/a)</option>
                    <option value="PENATA_MUDA_TK_I_IIIB">Penata Muda Tk. I (III/b)</option>
                    <option value="PENATA_IIIC">Penata (III/c)</option>
                    <option value="PENATA_TK_I_IIID">Penata Tk. I (III/d)</option>
                    <option value="PEMBINA_IVA">Pembina (IV/a)</option>
                    <option value="PEMBINA_TK_I_IVB">Pembina Tk. I (IV/b)</option>
                    <option value="PEMBINA_UTAMA_MUDA_IVC">Pembina Utama Muda (IV/c)</option>
                    <option value="PEMBINA_UTAMA_MADYA_IVD">Pembina Utama Madya (IV/d)</option>
                    <option value="PEMBINA_UTAMA_IVE">Pembina Utama (IV/e)</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="kompetensi">Bidang Kompetensi / Keahlian</Label>
                <Textarea 
                    id="kompetensi" 
                    name="kompetensi" 
                    required 
                    defaultValue={profilInfo?.kompetensi?.join(", ") || ""} 
                    placeholder="Contoh: Rekayasa Perangkat Lunak, Kecerdasan Buatan, IoT" 
                />
                <p className="text-xs text-zinc-500">Pisahkan setiap keahlian dengan tanda koma (,).</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="foto">Unggah Foto Profil Baru</Label>
                <Input id="foto" name="foto" type="file" accept="image/*" />
                <p className="text-xs text-zinc-500">Biarkan kosong jika tidak ingin mengubah foto saat ini.</p>
            </div>

            <Button type="submit" className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white">
                Simpan Profil Lengkap
            </Button>
        </form>
    );
}