import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createCPL, deleteCPL } from "@/src/app/actions/cpl";

const prisma = new PrismaClient();

export default async function CPLPage({ 
    params 
    }: { 
    params: Promise<{ id: string }> 
    }) {
    const { id } = await params;

    const kurikulum = await prisma.kurikulum.findUnique({
        where: { id },
        include: {
            cpl: {
                orderBy: { kode: 'asc' }
            }
        }
    });

    if (!kurikulum) {
        return <div>Kurikulum tidak ditemukan.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/kurikulum">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Capaian Pembelajaran Lulusan (CPL)</h2>
                    <p className="text-zinc-500">
                        Mengelola CPL untuk kurikulum: <strong className="text-zinc-900">{kurikulum.nama}</strong>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1">
                    <form action={createCPL} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
                        <h3 className="font-semibold text-lg border-b pb-2">Tambah CPL</h3>
                        
                        <input type="hidden" name="kurikulumId" value={kurikulum.id} />

                        <div className="space-y-2">
                            <Label htmlFor="kode">Kode CPL</Label>
                            <Input id="kode" name="kode" required placeholder="Contoh: CPL01" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi Capaian Pembelajaran</Label>
                            <Textarea 
                                id="deskripsi" 
                                name="deskripsi" 
                                required
                                placeholder="Contoh: Mampu mengaplikasikan bidang keahlian dan memanfaatkan IPTEKS pada bidangnya..." 
                                className="h-32"
                            />
                        </div>

                        <Button type="submit" className="w-full">Simpan CPL</Button>
                    </form>
                </div>

                <div className="md:col-span-2 rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Kode</TableHead>
                                <TableHead>Deskripsi CPL</TableHead>
                                <TableHead className="text-right w-16">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kurikulum.cpl.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold align-top">{item.kode}</TableCell>
                                    <TableCell className="align-top text-zinc-700 line-clamp-1 truncate">{item.deskripsi}</TableCell>
                                    <TableCell className="text-right align-top">
                                        <form action={deleteCPL.bind(null, item.id, kurikulum.id)}>
                                            <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {kurikulum.cpl.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-zinc-500 h-32">
                                        Belum ada CPL di kurikulum ini.
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