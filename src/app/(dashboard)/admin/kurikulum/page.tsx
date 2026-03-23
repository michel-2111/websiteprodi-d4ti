import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { setKurikulumAktif, deleteKurikulum } from "@/src/app/actions/kurikulum";
import { FileText, CheckCircle, Trash2, BookOpen } from "lucide-react";

const prisma = new PrismaClient();

export default async function KurikulumPage() {
    const dataKurikulum = await prisma.kurikulum.findMany({
        orderBy: { tahunMulai: 'desc' }
    });

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Data Kurikulum</h2>
            <p className="text-zinc-500">Kelola kurikulum dan mata kuliah Prodi D4 TI.</p>
            </div>
            <Link href="/admin/kurikulum/tambah">
            <Button>+ Tambah Kurikulum</Button>
            </Link>
        </div>

        <div className="rounded-md border bg-white">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Kurikulum</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dokumen</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {dataKurikulum.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>{item.tahunMulai}</TableCell>
                    <TableCell>
                    {item.aktif ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Aktif Digunakan</Badge>
                    ) : (
                        <Badge variant="outline" className="text-zinc-500">Arsip</Badge>
                    )}
                    </TableCell>
                    <TableCell>
                    {item.dokumenUrl ? (
                        <a href={item.dokumenUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline text-sm">
                        <FileText className="h-4 w-4 mr-1" /> PDF
                        </a>
                    ) : "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                    {!item.aktif && (
                        <form action={setKurikulumAktif.bind(null, item.id)} className="inline-block">
                        <Button variant="outline" size="sm" type="submit" className="text-blue-600">
                            <CheckCircle className="h-4 w-4 mr-1" /> Set Aktif
                        </Button>
                        </form>
                    )}
                
                    <Link href={`/admin/kurikulum/${item.id}/matakuliah`}>
                        <Button variant="secondary" size="sm">
                        <BookOpen className="h-4 w-4 mr-1" /> Mata Kuliah
                        </Button>
                    </Link>

                    <form action={deleteKurikulum.bind(null, item.id)} className="inline-block">
                        <Button variant="destructive" size="sm" type="submit">
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </form>
                    </TableCell>
                </TableRow>
                ))}
                {dataKurikulum.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500 h-24">
                    Belum ada data kurikulum.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        </div>
    );
}