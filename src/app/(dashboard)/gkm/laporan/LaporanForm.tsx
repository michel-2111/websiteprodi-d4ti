"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createLaporan } from "@/src/app/actions/gkm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LaporanForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const promise = createLaporan(formData).then(() => formRef.current?.reset());

        toast.promise(promise, {
        loading: "Mengunggah laporan GKM...",
        success: "Laporan berhasil disimpan!",
        error: (err) => err.message || "Gagal menyimpan laporan.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
        <h3 className="font-semibold text-lg border-b pb-2">Unggah Laporan GKM</h3>
        
        <div className="space-y-2">
            <Label htmlFor="judul">Judul Laporan</Label>
            <Input id="judul" name="judul" required placeholder="Contoh: Laporan Audit Mutu Internal (AMI)" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="semester">Semester & Tahun Akademik</Label>
            <Input id="semester" name="semester" required placeholder="Contoh: Ganjil 2025/2026" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="dokumen">File Dokumen (PDF Wajib)</Label>
            <Input id="dokumen" name="dokumen" type="file" accept=".pdf" required />
        </div>

        <div className="space-y-2">
            <Label htmlFor="dokumentasi">Foto Dokumentasi (Opsional)</Label>
            <Input id="dokumentasi" name="dokumentasi" type="file" accept="image/*" multiple />
            <p className="text-xs text-zinc-500">Bisa pilih lebih dari satu gambar (Max 10MB per gambar).</p>
        </div>

        <Button type="submit" className="w-full mt-2">Simpan Laporan</Button>
        </form>
    );
}