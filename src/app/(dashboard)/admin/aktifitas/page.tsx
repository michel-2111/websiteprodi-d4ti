import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteAktifitas } from "@/src/app/actions/aktifitas";
import { Trash2, Plus, Calendar, FileText, Archive } from "lucide-react";

const prisma = new PrismaClient();

export default async function AktifitasPage() {
    const aktifitas = await prisma.aktifitas.findMany({
        orderBy: { tanggal: 'desc' }
    });

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Data Kegiatan Tri Dharma</h2>
            <p className="text-zinc-500">Kelola publikasi kegiatan Prodi D4 TI.</p>
            </div>
            <Link href="/admin/aktifitas/tambah">
            <Button><Plus className="h-4 w-4 mr-2" /> Tambah Kegiatan</Button>
            </Link>
        </div>

        <div className="rounded-md border bg-white">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-30">Dokumentasi</TableHead>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {aktifitas.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                        <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-zinc-100 flex items-center justify-center group">
                            
                            {item.gambarUrls[0]?.match(/\.(zip|rar|7z|tar|gz)(?:\?.*)?$/i) ? (
                                <div className="flex flex-col items-center justify-center w-full h-full bg-amber-50/80 text-amber-600">
                                    <Archive className="h-6 w-6 mb-1" />
                                    <span className="text-[9px] font-bold uppercase">Arsip ZIP</span>
                                </div>
                                
                            ) : item.gambarUrls[0]?.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)(?:\?.*)?$/i) ? (
                                <div className="flex flex-col items-center justify-center w-full h-full bg-blue-50/50 text-blue-500">
                                    <FileText className="h-6 w-6 mb-1" />
                                    <span className="text-[9px] font-bold uppercase">Dokumen</span>
                                </div>
                                
                            ) : (
                                <img 
                                    src={item.gambarUrls[0]} 
                                    alt={item.nama} 
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                            )}

                            {item.gambarUrls.length > 1 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                                    +{item.gambarUrls.length - 1}
                                </div>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="max-w-50 font-medium truncate">{item.nama}</TableCell>
                    <TableCell>
                    <div className="flex items-center text-zinc-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {item.tanggal ? item.tanggal.toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                        }) : '-'}
                    </div>
                    </TableCell>
                    <TableCell className="max-w-50 truncate text-zinc-500" title={item.deskripsi}>
                    {item.deskripsi}
                    </TableCell>
                    <TableCell className="text-right">
                    <form action={deleteAktifitas.bind(null, item.id)}>
                        <Button variant="destructive" size="sm" type="submit" title="Hapus Aktifitas">
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </form>
                    </TableCell>
                </TableRow>
                ))}
                {aktifitas.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500 h-24">
                    Belum ada data aktifitas.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        </div>
    );
}