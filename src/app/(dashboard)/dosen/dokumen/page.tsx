import { PrismaClient } from "@prisma/client";
import { FileText, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const prisma = new PrismaClient();

export default async function DosenDokumenPage() {
    const dokumenList = await prisma.dokumen.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <FileText className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pusat Unduhan Dokumen</h2>
                    <p className="text-zinc-500">Akses pedoman, template, dan dokumen internal program studi.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="w-1/3">Nama Dokumen</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead className="w-32">Tanggal</TableHead>
                            <TableHead className="text-right w-32">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dokumenList.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-zinc-50/50">
                                <TableCell className="font-semibold text-zinc-900">{doc.nama}</TableCell>
                                <TableCell className="text-zinc-600 text-sm whitespace-pre-wrap">{doc.keterangan || "-"}</TableCell>
                                <TableCell className="text-zinc-500 text-sm">
                                    {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <a 
                                        href={doc.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border border-indigo-200"
                                    >
                                        <Download className="h-3.5 w-3.5" /> Unduh
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                        {dokumenList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-zinc-500 py-12">
                                    Belum ada dokumen yang dibagikan oleh Admin.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}