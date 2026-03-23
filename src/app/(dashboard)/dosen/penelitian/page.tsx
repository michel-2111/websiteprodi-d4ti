import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deletePenelitian } from "@/src/app/actions/penelitian";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Search } from "lucide-react";
import PenelitianForm from "./PenelitianForm";

const prisma = new PrismaClient();

export default async function PenelitianPage() {
    const session = await getServerSession(authOptions);
    
    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session?.user?.id },
        include: {
        penelitian: {
            orderBy: { tahun: 'desc' } 
        }
        }
    });

    const penelitianList = profile?.penelitian || [];

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Search className="h-6 w-6" />
            </div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Data Penelitian</h2>
            <p className="text-zinc-500">Kelola rekam jejak penelitian dan hibah yang telah Anda laksanakan.</p>
            </div>
        </div>

        {!profile && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
            <strong>Peringatan:</strong> Anda belum melengkapi data profil. Silakan isi NIDN Anda di menu "Profil Saya" terlebih dahulu sebelum menambahkan penelitian.
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1">
            {profile && <PenelitianForm />}
            </div>

            <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="w-20">Foto</TableHead>
                <TableHead className="w-25">Tahun</TableHead>
                <TableHead>Judul Penelitian</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                    </TableHeader>
                    <TableBody>
                    {penelitianList.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell>
                            {item.gambarUrl ? (
                            <div className="h-12 w-16 overflow-hidden rounded-md border bg-zinc-100">
                                <img src={item.gambarUrl} alt="Dokumentasi" className="object-cover w-full h-full" />
                            </div>
                            ) : (
                            <span className="text-xs text-zinc-400 italic">Tidak ada</span>
                            )}
                        </TableCell>
                        
                        <TableCell className="font-bold text-zinc-700">{item.tahun}</TableCell>
                        <TableCell className="font-medium text-zinc-900">{item.judul}</TableCell>
                        <TableCell className="text-right">
                            <form action={deletePenelitian.bind(null, item.id)}>
                            <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Hapus Penelitian">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </form>
                        </TableCell>
                        </TableRow>
                    ))}
                {penelitianList.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={3} className="text-center text-zinc-500 h-32">
                        Belum ada data penelitian yang ditambahkan.
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