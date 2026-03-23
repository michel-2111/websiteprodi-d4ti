import { PrismaClient } from "@prisma/client";
import { upsertStatistik, deleteStatistik } from "@/src/app/actions/statistik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, TrendingUp } from "lucide-react";

const prisma = new PrismaClient();

export default async function StatistikPage() {
    const statistik = await prisma.statistikMahasiswa.findMany({
        orderBy: { tahun: 'desc' }
    });

    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <TrendingUp className="h-6 w-6" />
            </div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Statistik Mahasiswa</h2>
            <p className="text-zinc-500">Kelola data pendaftar dan lulusan untuk grafik di Landing Page.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1">
            <form action={upsertStatistik} className="space-y-4 bg-white p-5 rounded-md border sticky top-6">
                <h3 className="font-semibold text-lg border-b pb-2">Input Data Tahun</h3>
                <p className="text-xs text-zinc-500 mb-4">Jika tahun sudah ada, data akan otomatis diperbarui.</p>

                <div className="space-y-2">
                <Label htmlFor="tahun">Tahun Akademik</Label>
                <Input id="tahun" name="tahun" type="number" required defaultValue={currentYear} />
                </div>

                <div className="space-y-2">
                <Label htmlFor="pendaftar">Jumlah Pendaftar</Label>
                <Input id="pendaftar" name="pendaftar" type="number" required min="0" placeholder="Contoh: 450" />
                </div>

                <div className="space-y-2">
                <Label htmlFor="diterima">Jumlah Diterima</Label>
                <Input id="diterima" name="diterima" type="number" required min="0" placeholder="Contoh: 120" />
                </div>

                <div className="space-y-2">
                <Label htmlFor="lulusan">Jumlah Lulusan</Label>
                <Input id="lulusan" name="lulusan" type="number" required min="0" placeholder="Contoh: 115" />
                </div>

                <Button type="submit" className="w-full mt-2">Simpan Statistik</Button>
            </form>
            </div>

            <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-center">Tahun</TableHead>
                    <TableHead className="text-right">Pendaftar</TableHead>
                    <TableHead className="text-right">Diterima</TableHead>
                    <TableHead className="text-right">Lulusan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {statistik.map((stat) => (
                    <TableRow key={stat.id}>
                    <TableCell className="font-bold text-center">{stat.tahun}</TableCell>
                    <TableCell className="text-right">{stat.pendaftar.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-blue-600 font-medium">{stat.diterima.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">{stat.lulusan.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                        <form action={deleteStatistik.bind(null, stat.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </form>
                    </TableCell>
                    </TableRow>
                ))}
                {statistik.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500 h-32">
                        Belum ada data statistik tahunan yang diinput.
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