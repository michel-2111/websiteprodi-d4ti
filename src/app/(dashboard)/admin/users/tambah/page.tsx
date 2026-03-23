import { createUser } from "@/src/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function TambahUserPage() {
    return (
        <div className="max-w-2xl space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Tambah Pengguna Baru</h2>
            <p className="text-zinc-500">Buat kredensial untuk Dosen atau GKM agar mereka bisa login.</p>
        </div>

        <form action={createUser} className="space-y-6 bg-white p-6 rounded-md border">
            <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" required placeholder="Masukkan nama lengkap" />
            </div>

            <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="email@polimdo.ac.id" />
            </div>

            <div className="space-y-2">
            <Label htmlFor="password">Password Default</Label>
            <Input id="password" name="password" type="text" required defaultValue="Polimdo2026!" />
            <p className="text-xs text-zinc-500">Berikan password ini kepada pengguna terkait.</p>
            </div>

            <div className="space-y-2">
            <Label htmlFor="role">Role / Peran</Label>
            <Select name="role" required defaultValue="DOSEN">
                <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="DOSEN">Dosen</SelectItem>
                <SelectItem value="GKM">Gugus Kendali Mutu (GKM)</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
            </Select>
            </div>

            <div className="flex gap-4">
            <Button type="submit">Simpan Pengguna</Button>
            <Link href="/admin/users">
                <Button type="button" variant="outline">Batal</Button>
            </Link>
            </div>
        </form>
        </div>
    );
}