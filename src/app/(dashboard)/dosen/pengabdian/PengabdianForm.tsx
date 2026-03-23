"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createPengabdian } from "@/src/app/actions/pengabdian";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PengabdianForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const promise = createPengabdian(formData).then(() => formRef.current?.reset());

        toast.promise(promise, {
        loading: "Menyimpan data pengabdian...",
        success: "Pengabdian berhasil ditambahkan!",
        error: (err) => err.message || "Gagal menyimpan pengabdian.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
        <h3 className="font-semibold text-lg border-b pb-2">Tambah Pengabdian</h3>
        <div className="space-y-2">
            <Label htmlFor="judul">Judul Kegiatan Pengabdian</Label>
            <Textarea id="judul" name="judul" required placeholder="Contoh: Pelatihan Digital Marketing bagi UMKM Manado" className="h-24" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="tahun">Tahun Pelaksanaan</Label>
            <Input id="tahun" name="tahun" type="number" required placeholder="2026" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="gambar">Foto Kegiatan</Label>
            <Input id="gambar" name="gambar" type="file" accept="image/*" />
            <p className="text-xs text-zinc-500">Unggah foto kegiatan pengabdian.</p>
        </div>
        <Button type="submit" className="w-full mt-4">Simpan Pengabdian</Button>
        </form>
    );
}