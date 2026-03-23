import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteFasilitas } from "@/src/app/actions/fasilitas";
import { Trash2, Plus } from "lucide-react";

const prisma = new PrismaClient();

export default async function FasilitasPage() {
    const fasilitas = await prisma.fasilitas.findMany({
        orderBy: { id: 'desc' }
    });

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Data Fasilitas</h2>
            <p className="text-zinc-500">Kelola informasi fasilitas yang ada di Prodi D4 TI.</p>
            </div>
            <Link href="/admin/fasilitas/tambah">
            <Button><Plus className="h-4 w-4 mr-2" /> Tambah Fasilitas</Button>
            </Link>
        </div>

        <div className="rounded-md border bg-white">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-30">Foto</TableHead>
                <TableHead>Nama Fasilitas</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fasilitas.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                    <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-zinc-100">
                        <img 
                        src={item.gambarUrls[0]} 
                        alt={item.nama} 
                        className="object-cover w-full h-full"
                        />
                        {item.gambarUrls.length > 1 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                            +{item.gambarUrls.length - 1}
                        </div>
                        )}
                    </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="max-w-xs truncate text-zinc-500" title={item.deskripsi}>
                    {item.deskripsi}
                    </TableCell>
                    <TableCell className="text-right">
                    <form action={deleteFasilitas.bind(null, item.id)}>
                        <Button variant="destructive" size="sm" type="submit" title="Hapus Fasilitas">
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </form>
                    </TableCell>
                </TableRow>
                ))}
                {fasilitas.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500 h-24">
                    Belum ada data fasilitas.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        </div>
    );
}