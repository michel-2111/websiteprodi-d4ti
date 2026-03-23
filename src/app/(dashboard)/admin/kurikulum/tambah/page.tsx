import { createKurikulum } from "@/src/app/actions/kurikulum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function TambahKurikulumPage() {
    return (
        <div className="max-w-2xl space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Tambah Kurikulum</h2>
            <p className="text-zinc-500">Masukkan data kurikulum baru beserta dokumen pengesahannya.</p>
        </div>

        <form action={createKurikulum} className="space-y-6 bg-white p-6 rounded-md border">
            <div className="space-y-2">
            <Label htmlFor="nama">Nama Kurikulum</Label>
            <Input id="nama" name="nama" required placeholder="Contoh: Kurikulum MBKM 2024" />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="tahunMulai">Tahun Berlaku</Label>
                <Input id="tahunMulai" name="tahunMulai" type="number" required min="2000" max="2099" placeholder="2024" />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="dokumen">Dokumen SK / Kurikulum (PDF)</Label>
                <Input id="dokumen" name="dokumen" type="file" accept=".pdf" />
                <p className="text-xs text-zinc-500">Opsional. Maksimal ukuran file tergantung setting Supabase.</p>
            </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
            <Textarea id="deskripsi" name="deskripsi" placeholder="Tuliskan deksripsi atau fokus dari kurikulum ini..." />
            </div>

            <div className="flex gap-4">
            <Button type="submit">Simpan Kurikulum</Button>
            <Link href="/admin/kurikulum">
                <Button type="button" variant="outline">Batal</Button>
            </Link>
            </div>
        </form>
        </div>
    );
}