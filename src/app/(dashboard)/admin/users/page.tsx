import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserActionButtons from "./UserActionButtons";

const prisma = new PrismaClient();

export default async function UsersPage() {
    // Ambil semua data user dari database, urutkan dari yang terbaru
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
            <p className="text-zinc-500">Kelola akun Admin, Dosen, dan GKM.</p>
            </div>
            <Link href="/admin/users/tambah">
            <Button>+ Tambah Pengguna</Button>
            </Link>
        </div>

        <div className="rounded-md border bg-white">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "-"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 
                        user.role === 'DOSEN' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                        {user.role}
                    </span>
                    </TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                        <UserActionButtons user={user} />
                    </TableCell>
                </TableRow>
                ))}
                {users.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500 h-24">
                    Belum ada data pengguna.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        </div>
    );
}