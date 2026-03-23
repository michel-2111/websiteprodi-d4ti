import { PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CheckCircle2, XCircle } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminDataDosenPage() {
    const dosenList = await prisma.user.findMany({
        where: { role: "DOSEN" },
        include: {
            dosenProfile: {
                include: {
                    _count: {
                        select: { 
                            publikasi: true, 
                            sertifikat: true,
                            penelitianKetua: true,
                            penelitianAnggota: true,
                            pengabdianKetua: true,
                            pengabdianAnggota: true,
                            bukuAjarKetua: true,
                            bukuAjarAnggota: true,
                            hkiKetua: true,
                            hkiAnggota: true
                        }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Dosen Prodi</h2>
                    <p className="text-zinc-500">Pantau daftar seluruh dosen dan kelengkapan profil mereka.</p>
                </div>
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="font-semibold text-zinc-900 w-62.5">Nama Dosen</TableHead>
                            <TableHead className="font-semibold text-zinc-900">Email Login</TableHead>
                            <TableHead className="font-semibold text-zinc-900">NIDN</TableHead>
                            <TableHead className="font-semibold text-zinc-900 text-center">Total Karya</TableHead>
                            <TableHead className="font-semibold text-zinc-900 text-center">Status Profil</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dosenList.map((dosen) => {
                            const profil = dosen.dosenProfile;
                            
                            const totalKarya = profil 
                                ? profil._count.publikasi + 
                                    profil._count.sertifikat +
                                    profil._count.penelitianKetua + 
                                    profil._count.penelitianAnggota +
                                    profil._count.pengabdianKetua + 
                                    profil._count.pengabdianAnggota +
                                    profil._count.bukuAjarKetua + 
                                    profil._count.bukuAjarAnggota +
                                    profil._count.hkiKetua + 
                                    profil._count.hkiAnggota
                                : 0;

                            return (
                                <TableRow key={dosen.id} className="hover:bg-zinc-50/50">
                                    <TableCell className="font-medium text-zinc-900">
                                        {dosen.name}
                                    </TableCell>
                                    <TableCell className="text-zinc-500">
                                        {dosen.email}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-zinc-600">
                                        {profil?.nidn || <span className="text-zinc-300 italic">Belum diisi</span>}
                                    </TableCell>
                                    <TableCell className="text-center font-medium text-blue-600">
                                        {totalKarya} item
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {profil ? (
                                            <div className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md ring-1 ring-inset ring-green-600/20">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Lengkap
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-md ring-1 ring-inset ring-red-600/10">
                                                <XCircle className="h-3 w-3 mr-1" /> Kosong
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {dosenList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-zinc-500 py-12">
                                    Belum ada pengguna dengan akses Dosen yang terdaftar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}