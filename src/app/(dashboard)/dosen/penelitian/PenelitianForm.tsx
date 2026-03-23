"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createPenelitian } from "@/src/app/actions/penelitian";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PenelitianForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const promise = createPenelitian(formData).then(() => {
        formRef.current?.reset();
        });

        toast.promise(promise, {
        loading: "Menyimpan data penelitian...",
        success: "Penelitian berhasil ditambahkan!",
        error: (err) => err.message || "Gagal menyimpan penelitian.",
        });
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
            className="h-24" 
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="tahun">Tahun Pelaksanaan</Label>
            <Input id="tahun" name="tahun" type="number" required min="1990" max="2099" placeholder="2026" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="gambar">Dokumentasi (Opsional)</Label>
            <Input id="gambar" name="gambar" type="file" accept="image/*" />
            <p className="text-xs text-zinc-500">Unggah foto kegiatan penelitian atau luaran jika ada.</p>
        </div>
        <Button type="submit" className="w-full mt-4">Simpan Penelitian</Button>
        </form>
    );
}