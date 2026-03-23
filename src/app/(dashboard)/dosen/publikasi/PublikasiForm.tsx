"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createPublikasi } from "@/src/app/actions/publikasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PublikasiForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const promise = createPublikasi(formData).then(() => {
        formRef.current?.reset();
        });

        toast.promise(promise, {
        loading: "Menyimpan publikasi...",
        success: "Data publikasi berhasil ditambahkan!",
        error: (err) => err.message || "Gagal menyimpan publikasi.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
        <h3 className="font-semibold text-lg border-b pb-2">Tambah Publikasi</h3>

        <div className="space-y-2">
            <Label htmlFor="judul">Judul Publikasi / Jurnal</Label>
            <Textarea id="judul" name="judul" required placeholder="Contoh: Implementasi Sistem Pakar..." className="h-16" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="tahun">Tahun Terbit</Label>
            <Input id="tahun" name="tahun" type="number" required min="1990" max="2099" placeholder="2026" />
            </div>
            <div className="space-y-2">
            <Label htmlFor="lokasi">Lokasi / Nama Jurnal</Label>
            <Input id="lokasi" name="lokasi" required placeholder="Contoh: SINTA 3, Jurnal TI" />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="url">Tautan / Link Jurnal (Opsional)</Label>
            <Input id="url" name="url" type="url" placeholder="https://doi.org/..." />
        </div>

        <div className="space-y-2">
            <Label htmlFor="abstrak">Abstrak (Opsional)</Label>
            <Textarea id="abstrak" name="abstrak" placeholder="Tuliskan abstrak singkat dari publikasi ini..." className="h-24" />
        </div>

        <Button type="submit" className="w-full">Simpan Publikasi</Button>
        </form>
    );
}