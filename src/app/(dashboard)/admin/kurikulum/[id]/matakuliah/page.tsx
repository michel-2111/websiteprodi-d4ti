import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createMataKuliah, deleteMataKuliah } from "@/src/app/actions/matakuliah";

const prisma = new PrismaClient();

export default async function MataKuliahPage({ 
    params 
    }: { 
    params: Promise<{ id: string }> 
    }) {
    const { id } = await params;

    const kurikulum = await prisma.kurikulum.findUnique({
        where: { id },
        include: {
        mataKuliah: {
            orderBy: [
            { semester: 'asc' },
            { nama: 'asc' }
            ]
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
            <h2 className="text-2xl font-bold tracking-tight">Mata Kuliah</h2>
            <p className="text-zinc-500">
                Mengelola mata kuliah untuk kurikulum: <strong className="text-zinc-900">{kurikulum.nama}</strong>
            </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1">
            <form action={createMataKuliah} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
                <h3 className="font-semibold text-lg border-b pb-2">Tambah Mata Kuliah</h3>
                
                <input type="hidden" name="kurikulumId" value={kurikulum.id} />

                <div className="space-y-2">
                <Label htmlFor="kodeMk">Kode MK</Label>
                <Input id="kodeMk" name="kodeMk" required placeholder="Contoh: TIK401" />
                </div>

                <div className="space-y-2">
                <Label htmlFor="nama">Nama Mata Kuliah</Label>
                <Input id="nama" name="nama" required placeholder="Contoh: Pemrograman Web" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="sks">SKS</Label>
                    <Input id="sks" name="sks" type="number" required min="1" max="6" placeholder="3" />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input id="semester" name="semester" type="number" required min="1" max="8" placeholder="1" />
                </div>
                </div>

                <div className="space-y-2">
                <Label htmlFor="jenis">Jenis MK</Label>
                <Select name="jenis" required defaultValue="Wajib">
                    <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Wajib">Wajib</SelectItem>
                    <SelectItem value="Pilihan">Pilihan</SelectItem>
                    <SelectItem value="Praktikum">Praktikum</SelectItem>
                    <SelectItem value="Teori">Teori</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Mata Kuliah</Label>
                <Textarea 
                    id="deskripsi" 
                    name="deskripsi" 
                    placeholder="Penjelasan singkat apa yang akan dipelajari mahasiswa pada mata kuliah ini..." 
                    className="h-20"
                />
                </div>

                <Button type="submit" className="w-full">Simpan Mata Kuliah</Button>
            </form>
            </div>

            <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Sem</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {kurikulum.mataKuliah.map((mk) => (
                    <TableRow key={mk.id}>
                    <TableCell className="font-medium text-center">{mk.semester}</TableCell>
                    <TableCell>{mk.kodeMk}</TableCell>
                    <TableCell className="font-medium">{mk.nama}</TableCell>
                    <TableCell>{mk.sks}</TableCell>
                    <TableCell>{mk.jenis}</TableCell>
                    <TableCell className="text-right">
                        <form action={deleteMataKuliah.bind(null, mk.id, kurikulum.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </form>
                    </TableCell>
                    </TableRow>
                ))}
                {kurikulum.mataKuliah.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500 h-32">
                        Belum ada mata kuliah di kurikulum ini.
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