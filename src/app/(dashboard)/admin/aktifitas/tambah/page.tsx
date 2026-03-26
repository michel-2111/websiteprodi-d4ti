import { createAktifitas } from "@/src/app/actions/aktifitas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function TambahAktifitasPage() {
    return (
        <div className="max-w-2xl space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Tambah Data Tri Dharma</h2>
            <p className="text-zinc-500">Publikasikan kegiatan Pendidikan, Penelitian, atau Pengabdian kepada Masyarakat.</p>
        </div>

        <form action={createAktifitas} className="space-y-6 bg-white p-6 rounded-md border">
            <div className="space-y-2">
            <Label htmlFor="nama">Nama Kegiatan/Dokumen</Label>
            <Input id="nama" name="nama" required placeholder="Contoh: Pengabdian Masyarakat di Desa Bahari 2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal Pelaksanaan/Publikasi</Label>
                <Input id="tanggal" name="tanggal" type="date" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="gambar">Foto Kegiatan/ File Dokumen (Max 10MB)</Label>
                <Input id="gambar" name="gambar" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple required />
                <p className="text-xs text-zinc-500">Bisa pilih lebih dari satu gambar.</p>
            </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi Kegiatan/Dokumen</Label>
            <Textarea 
                id="deskripsi" 
                name="deskripsi" 
                required 
                placeholder="masukkan deskripsi kegiatan/dokumen..." 
                className="h-32"
            />
            </div>

            <div className="flex gap-4">
            <Button type="submit">Simpan Aktifitas</Button>
            <Link href="/admin/aktifitas">
                <Button type="button" variant="outline">Batal</Button>
            </Link>
            </div>
        </form>
        </div>
    );
}