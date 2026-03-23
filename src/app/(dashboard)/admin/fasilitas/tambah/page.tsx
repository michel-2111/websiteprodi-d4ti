import { createFasilitas } from "@/src/app/actions/fasilitas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function TambahFasilitasPage() {
    return (
        <div className="max-w-2xl space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Tambah Fasilitas</h2>
            <p className="text-zinc-500">Tambahkan fasilitas prodi beserta foto untuk ditampilkan pada Landing Page.</p>
        </div>

        <form action={createFasilitas} className="space-y-6 bg-white p-6 rounded-md border">
            <div className="space-y-2">
            <Label htmlFor="nama">Nama Fasilitas</Label>
            <Input id="nama" name="nama" required placeholder="Contoh: Laboratorium Komputer Lanjut" />
            </div>

            <div className="space-y-2">
            <Label htmlFor="gambar">Foto Fasilitas</Label>
            <Input id="gambar" name="gambar" type="file" accept="image/*" multiple required />
                <p className="text-xs text-zinc-500">
                Anda dapat memilih lebih dari satu gambar. <strong className="text-zinc-700">Maksimal total ukuran file: 10MB.</strong>
                </p>
            </div>

            <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi Fasilitas</Label>
            <Textarea 
                id="deskripsi" 
                name="deskripsi" 
                required 
                placeholder="Jelaskan kegunaan, spesifikasi, atau kapasitas fasilitas ini..." 
                className="h-32"
            />
            </div>

            <div className="flex gap-4">
            <Button type="submit">Simpan Fasilitas</Button>
            <Link href="/admin/fasilitas">
                <Button type="button" variant="outline">Batal</Button>
            </Link>
            </div>
        </form>
        </div>
    );
}