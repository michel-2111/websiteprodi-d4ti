import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deleteBukuAjar } from "@/src/app/actions/buku";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, BookOpen, ShieldAlert, ExternalLink } from "lucide-react";
import BukuForm from "./BukuForm";

const prisma = new PrismaClient();

export default async function BukuAjarPage() {
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

    const bukuList = profil ? await prisma.bukuAjar.findMany({
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
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><BookOpen className="h-6 w-6" /></div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Karya Buku Ajar</h2>
                    <p className="text-zinc-500">Kelola riwayat penulisan dan publikasi buku Anda.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                    <BukuForm dosenList={dosenListRaw} />
                </div>
                
                <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-[80px]">Tahun</TableHead>
                                <TableHead>Detail Buku & Penulis</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bukuList.map((item) => {
                                const isKetua = profil && item.ketuaId === profil.id;

                                return (
                                    <TableRow key={item.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="font-bold text-zinc-700 align-top pt-4">
                                            {item.tahun}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isKetua ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
                                                    Penulis {isKetua ? 'Utama' : 'Anggota'}
                                                </span>
                                            </div>
                                            
                                            <div className="font-semibold text-zinc-900 mb-1">{item.judul}</div>
                                            
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-blue-600 hover:underline mb-3">
                                                    <ExternalLink className="h-3 w-3 mr-1" /> Kunjungi Tautan
                                                </a>
                                            )}
                                            
                                            <div className="text-xs text-zinc-600 space-y-1 bg-zinc-50 p-2 rounded-md border border-zinc-100 mt-2">
                                                <div className="flex items-start">
                                                    <span className="font-semibold w-24 shrink-0">Penulis Utama</span>
                                                    <span>: {item.ketua?.user?.name || "-"}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="font-semibold w-24 shrink-0">Rekan Penulis</span>
                                                    <span>: {item.anggota.length > 0 ? item.anggota.map(a => a.user?.name).join(', ') : "-"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right align-top pt-4">
                                            {isKetua ? (
                                                <form action={deleteBukuAjar.bind(null, item.id)}>
                                                    <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            ) : (
                                                <div className="inline-flex flex-col items-center justify-center text-zinc-400 mt-1" title="Hanya Penulis Utama yang dapat menghapus data ini">
                                                    <ShieldAlert className="h-4 w-4 mb-1" />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {bukuList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-zinc-500 py-12">
                                        Anda belum memiliki riwayat karya buku ajar.
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