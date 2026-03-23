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
        error: "Gagal menyimpan profil. Pastikan NIDN valid dan tidak duplikat.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
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

        <Button type="submit" className="w-full mt-4">Simpan Profil</Button>
        </form>
    );
}