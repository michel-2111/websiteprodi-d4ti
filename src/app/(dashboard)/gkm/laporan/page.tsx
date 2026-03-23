import { PrismaClient } from "@prisma/client";
import { deleteLaporan } from "@/src/app/actions/gkm";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, FileCheck, FileText, Image as ImageIcon } from "lucide-react";
import LaporanForm from "./LaporanForm";

const prisma = new PrismaClient();

export default async function LaporanMutuPage() {
    const laporanList = await prisma.laporanGkm.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <FileCheck className="h-6 w-6" />
            </div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Laporan GKM</h2>
            <p className="text-zinc-500">Kelola arsip dokumen dan bukti kegiatan Gugus Kendali Mutu.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1"><LaporanForm /></div>
            
            <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-20">Foto</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Judul & Dokumen</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {laporanList.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell>
                        {item.dokumentasiUrls && item.dokumentasiUrls.length > 0 ? (
                        <div className="relative h-12 w-16 overflow-hidden rounded-md border bg-zinc-100">
                            <img src={item.dokumentasiUrls[0]} alt="Dokumentasi" className="object-cover w-full h-full" />
                            {item.dokumentasiUrls.length > 1 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                                +{item.dokumentasiUrls.length - 1}
                            </div>
                            )}
                        </div>
                        ) : (
                        <div className="h-12 w-16 flex items-center justify-center rounded-md border bg-zinc-50 text-zinc-300">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        )}
                    </TableCell>
                    <TableCell>
                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 font-mono">
                        {item.semester}
                        </span>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium text-zinc-900">{item.judul}</div>
                        <a href={item.dokumenUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium text-blue-600 mt-1 hover:underline bg-blue-50 px-2 py-0.5 rounded">
                        <FileText className="h-3 w-3 mr-1" /> Buka Dokumen PDF
                        </a>
                    </TableCell>
                    <TableCell className="text-right">
                        <form action={deleteLaporan.bind(null, item.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </form>
                    </TableCell>
                    </TableRow>
                ))}
                {laporanList.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500 h-32">
                        Belum ada data laporan GKM.
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