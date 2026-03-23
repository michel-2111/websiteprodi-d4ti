"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createSertifikat } from "@/src/app/actions/sertifikat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SertifikatForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const promise = createSertifikat(formData).then(() => formRef.current?.reset());

        toast.promise(promise, {
        loading: "Mengunggah sertifikat...",
        success: "Sertifikat berhasil disimpan!",
        error: (err) => err.message || "Gagal mengunggah sertifikat.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
        <h3 className="font-semibold text-lg border-b pb-2">Tambah Sertifikasi</h3>
        
        <div className="space-y-2">
            <Label htmlFor="namaPelatihan">Nama Pelatihan / Sertifikasi</Label>
            <Input 
            id="namaPelatihan" 
            name="namaPelatihan" 
            required 
            placeholder="Contoh: Cisco Certified Network Associate" 
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="tahun">Tahun Perolehan</Label>
            <Input id="tahun" name="tahun" type="number" required placeholder="2026" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="dokumen">File Sertifikat (PDF)</Label>
            <Input id="dokumen" name="dokumen" type="file" accept=".pdf" required />
        </div>

        <Button type="submit" className="w-full mt-2">Unggah Sertifikat</Button>
        </form>
    );
}