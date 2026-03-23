import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deleteHki } from "@/src/app/actions/hki";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ShieldAlert, ExternalLink, Lightbulb } from "lucide-react";
import HkiForm from "./HkiForm";

const prisma = new PrismaClient();

export default async function HkiPage() {
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

    // Tarik data HKI
    const hkiList = profil ? await prisma.hki.findMany({
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
        orderBy: { id: 'desc' } // Karena tahun opsional, urutkan dari yang terbaru ditambahkan
    }) : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg"><Lightbulb className="h-6 w-6" /></div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Kekayaan Intelektual</h2>
                    <p className="text-zinc-500">Kelola riwayat Paten, Hak Cipta, Merek, dan karya HKI lainnya.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                    <HkiForm dosenList={dosenListRaw} />
                </div>
                
                <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-[120px]">Kategori</TableHead>
                                <TableHead>Detail Ciptaan & Inventor</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hkiList.map((item) => {
                                const isKetua = profil && item.ketuaId === profil.id;

                                return (
                                    <TableRow key={item.id} className="hover:bg-zinc-50/50">
                                        <TableCell className="align-top pt-4">
                                            <span className="inline-flex text-[11px] font-bold uppercase tracking-wider bg-zinc-800 text-white px-2 py-1 rounded">
                                                {item.kategori}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isKetua ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
                                                    Inventor {isKetua ? 'Utama' : 'Anggota'}
                                                </span>
                                                {item.tahun && <span className="text-xs font-bold text-zinc-500">{item.tahun}</span>}
                                            </div>
                                            
                                            <div className="font-semibold text-zinc-900 mb-1">{item.judul}</div>
                                            
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-blue-600 hover:underline mb-3">
                                                    <ExternalLink className="h-3 w-3 mr-1" /> Cek Status
                                                </a>
                                            )}
                                            
                                            <div className="text-xs text-zinc-600 space-y-1 bg-zinc-50 p-2 rounded-md border border-zinc-100 mt-2">
                                                <div className="flex items-start">
                                                    <span className="font-semibold w-24 shrink-0">Inventor Utama</span>
                                                    <span>: {item.ketua?.user?.name || "-"}</span>
                                                </div>
                                                {item.anggota.length > 0 && (
                                                    <div className="flex items-start">
                                                        <span className="font-semibold w-24 shrink-0">Anggota</span>
                                                        <span>: {item.anggota.map(a => a.user?.name).join(', ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right align-top pt-4">
                                            {isKetua ? (
                                                <form action={deleteHki.bind(null, item.id)}>
                                                    <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            ) : (
                                                <div className="inline-flex flex-col items-center justify-center text-zinc-400 mt-1" title="Hanya Inventor Utama yang dapat menghapus data ini">
                                                    <ShieldAlert className="h-4 w-4 mb-1" />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {hkiList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-zinc-500 py-12">
                                        Anda belum memiliki riwayat Hak Kekayaan Intelektual.
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