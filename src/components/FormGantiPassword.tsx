"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { ubahPassword } from "../app/actions/akun";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

export default function FormGantiPassword() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const promise = ubahPassword(formData).then(() => {
        formRef.current?.reset();
        });

        toast.promise(promise, {
        loading: "Memverifikasi dan memperbarui password...",
        success: "Sukses! Password Anda berhasil diubah. Gunakan password baru ini saat login berikutnya.",
        error: (err) => err.message || "Gagal mengubah password.",
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4 bg-white p-6 md:p-8 rounded-2xl border shadow-sm max-w-md w-full">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
            <KeyRound className="h-5 w-5" />
            </div>
            <div>
            <h3 className="font-bold text-lg text-zinc-900">Ganti Password</h3>
            <p className="text-xs text-zinc-500">Pastikan akun Anda tetap aman.</p>
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="passwordLama">Password Saat Ini</Label>
            <Input id="passwordLama" name="passwordLama" type="password" required placeholder="Masukkan password lama" />
        </div>

        <div className="space-y-2 pt-2">
            <Label htmlFor="passwordBaru">Password Baru</Label>
            <Input id="passwordBaru" name="passwordBaru" type="password" required minLength={6} placeholder="Minimal 6 karakter" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="konfirmasiPassword">Konfirmasi Password Baru</Label>
            <Input id="konfirmasiPassword" name="konfirmasiPassword" type="password" required minLength={6} placeholder="Ketik ulang password baru" />
        </div>

        <Button type="submit" className="w-full mt-6 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md">
            Simpan Password Baru
        </Button>
        </form>
    );
}