import { PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getActiveProdiId } from "@/src/app/actions/prodi-context";
import { FileText, ExternalLink } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminAlihJenjangPage() {
    const activeProdiId = await getActiveProdiId();

    const pesertaList = await prisma.alihJenjang.findMany({
        where: { prodiId: activeProdiId || undefined },
        orderBy: { createdAt: "desc" },
        include: { prodi: true }
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Daftar Pendaftar Alih Jenjang</h2>
                <p className="text-zinc-500">Kelola dan tinjau berkas pendaftaran calon mahasiswa alih jenjang.</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Peserta</TableHead>
                            <TableHead>Kontak & Alamat</TableHead>
                            <TableHead>Dokumen Terlampir</TableHead>
                            <TableHead>Tanggal Daftar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pesertaList.length > 0 ? (
                            pesertaList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.nama}</TableCell>
                                    <TableCell className="text-sm">
                                        <div>{item.telepon}</div>
                                        <div className="text-zinc-500 text-xs">{item.alamat}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <a href={item.ijazahUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                                                <FileText className="h-3 w-3 mr-1" /> Ijazah
                                            </a>
                                            <a href={item.ktpUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                                                <FileText className="h-3 w-3 mr-1" /> KTP
                                            </a>
                                            <a href={item.cvUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                                                <FileText className="h-3 w-3 mr-1" /> CV
                                            </a>
                                            <a href={item.pasfotoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                                                <FileText className="h-3 w-3 mr-1" /> Pasfoto
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-zinc-500">
                                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                                    Belum ada data pendaftar alih jenjang.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}