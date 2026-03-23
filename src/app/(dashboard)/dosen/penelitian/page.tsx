import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import PenelitianForm from "./PenelitianForm";
import { deletePenelitian } from "@/src/app/actions/penelitian"; // <-- Import fungsi hapus
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function DosenPenelitianPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    const profil = await prisma.dosenProfile.findUnique({
        where: { userId }
    });

    const dosenListRaw = await prisma.dosenProfile.findMany({
        where: { 
            user: { name: { not: null } },
            userId: { not: userId } 
        },
        select: { id: true, user: { select: { name: true } } },
        orderBy: { user: { name: 'asc' } }
    });

    const penelitianList = profil ? await prisma.penelitian.findMany({
        where: {
            OR: [
                { ketuaId: profil.id },
                { anggota: { some: { id: profil.id } } }
            ]
        },
        include: { 
            ketua: { include: { user: true } },
            anggota: { include: { user: true } }
        },
        orderBy: { tahun: 'desc' }
    }) : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Search className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Penelitian</h2>
                    <p className="text-zinc-500">Kelola riwayat penelitian Anda, baik sebagai Ketua maupun Anggota.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                    <PenelitianForm dosenList={dosenListRaw} />
                </div>
                
                <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-20">Foto</TableHead>
                                <TableHead className="w-20">Tahun</TableHead>
                                <TableHead>Judul & Tim Peneliti</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {penelitianList.map((item) => {
                                const isKetua = profil && item.ketuaId === profil.id;

                                return (
                                    <TableRow key={item.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="align-top pt-4">
                                            {item.gambarUrls? (
                                                <img src={item.gambarUrls[0]} className="h-12 w-16 object-cover rounded border" alt="dok" />
                                            ) : (
                                                <span className="text-xs italic text-zinc-400">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-bold text-zinc-700 align-top pt-4">
                                            {item.tahun}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {/* Badge Peran */}
                                            <div className="mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isKetua ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
                                                    {isKetua ? 'Ketua' : 'Anggota'}
                                                </span>
                                            </div>
                                            
                                            <div className="font-semibold text-zinc-900 mb-2">{item.judul}</div>
                                            
                                            <div className="text-xs text-zinc-600 space-y-1 bg-zinc-50 p-2 rounded-md border border-zinc-100">
                                                <div className="flex items-start">
                                                    <span className="font-semibold w-16 shrink-0">Ketua</span>
                                                    <span>: {item.ketua?.user?.name || "-"}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="font-semibold w-16 shrink-0">Anggota</span>
                                                    <span>: {item.anggota.length > 0 ? item.anggota.map(a => a.user?.name).join(', ') : "-"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right align-top pt-4">
                                            {isKetua ? (
                                                <form action={deletePenelitian.bind(null, item.id)}>
                                                    <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            ) : (
                                                <div className="inline-flex flex-col items-center justify-center text-zinc-400 mt-1" title="Hanya Ketua yang dapat menghapus data ini">
                                                    <ShieldAlert className="h-4 w-4 mb-1" />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {penelitianList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-zinc-500 py-12">
                                        Anda belum memiliki riwayat penelitian.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}