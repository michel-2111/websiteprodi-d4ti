import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deleteSertifikat } from "@/src/app/actions/sertifikat";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Award, FileText } from "lucide-react";
import SertifikatForm from "./SertifikatForm";

const prisma = new PrismaClient();

export default async function SertifikatPage() {
    const session = await getServerSession(authOptions);
    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session?.user?.id },
        include: { sertifikat: { orderBy: { tahun: 'desc' } } }
    });

    const list = profile?.sertifikat || [];

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
            <Award className="h-6 w-6" />
            </div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Sertifikasi & Kompetensi</h2>
            <p className="text-zinc-500">Kelola sertifikat keahlian dan kompetensi profesional Anda.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">{profile && <SertifikatForm />}</div>
        <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Tahun</TableHead>
                    <TableHead>Nama Pelatihan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {list.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell className="font-bold">{item.tahun}</TableCell>
                    <TableCell>
                        <div className="font-medium">{item.namaPelatihan}</div>
                        {item.dokumenUrl && (
                        <a 
                            href={item.dokumenUrl} 
                            target="_blank" 
                            className="text-xs text-blue-600 flex items-center mt-1 hover:underline"
                        >
                            <FileText className="h-3 w-3 mr-1" /> Lihat Dokumen
                        </a>
                        )}
                    </TableCell>
                    <TableCell className="text-right">
                        <form action={deleteSertifikat.bind(null, item.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </form>
                    </TableCell>
                    </TableRow>
                ))}
                {list.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={3} className="text-center text-zinc-500 h-32">
                        Belum ada sertifikat.
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