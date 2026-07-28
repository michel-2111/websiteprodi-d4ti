"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { submitAlihJenjang } from "@/src/app/actions/alih-jenjang"; // Pastikan path import sesuai dengan direktori Anda

export default function FormAlihJenjang({ prodiId }: { prodiId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(""); // Reset error setiap kali submit ulang

        const formData = new FormData(e.currentTarget);
        formData.append("prodiId", prodiId);

        try {
            // Panggil Server Action ke Supabase
            const response = await submitAlihJenjang(formData);
            
            if (response.success) {
                setIsSuccess(true);
            } else {
                setErrorMessage(response.error || "Gagal mengirim pendaftaran.");
            }
        } catch (error) {
            console.error("Gagal mengirim formulir:", error);
            setErrorMessage("Terjadi kesalahan jaringan atau server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-10 bg-green-50 rounded-xl border border-green-100">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Pendaftaran Berhasil!</h3>
                <p className="text-green-700 max-w-md mx-auto">
                    Berkas alih jenjang Anda telah berhasil dikirim dan akan segera ditinjau oleh Admin Program Studi.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tampilkan pesan error jika ada */}
            {errorMessage && (
                <div className="p-4 text-sm text-red-800 rounded-xl bg-red-50 border border-red-200 font-medium">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-4">
                {/* Data Diri */}
                <div className="grid gap-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input id="nama" name="nama" placeholder="Masukkan nama lengkap beserta gelar (jika ada)" required />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="telepon">Nomor Telepon / WhatsApp</Label>
                    <Input id="telepon" name="telepon" type="tel" placeholder="Contoh: 08123456789" required />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                    <textarea 
                        id="alamat" 
                        name="alamat" 
                        rows={3}
                        className="flex min-h-20 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Masukkan alamat domisili saat ini" 
                        required 
                    />
                </div>
            </div>

            <div className="border-t border-zinc-100 pt-6 space-y-4">
                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-blue-600" />
                    Unggah Dokumen Persyaratan
                </h3>
                <p className="text-xs text-zinc-500 mb-4">Pastikan file berformat PDF atau Gambar (JPG/PNG) dengan ukuran maksimal 5MB per file.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="ktp">Scan KTP Asli</Label>
                        <Input id="ktp" name="ktp" type="file" accept=".pdf,image/*" required className="cursor-pointer file:text-blue-600" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="pasfoto">Pasfoto Terbaru</Label>
                        <Input id="pasfoto" name="pasfoto" type="file" accept="image/*" required className="cursor-pointer file:text-blue-600" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ijazah">Scan Ijazah Terakhir Asli</Label>
                        <Input id="ijazah" name="ijazah" type="file" accept=".pdf,image/*" required className="cursor-pointer file:text-blue-600" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cv">Curriculum Vitae (CV)</Label>
                        <Input id="cv" name="cv" type="file" accept=".pdf" required className="cursor-pointer file:text-blue-600" />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Mengirim Berkas...
                        </>
                    ) : (
                        "Kirim Pendaftaran"
                    )}
                </Button>
            </div>
        </form>
    );
}