import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deletePublikasi } from "@/src/app/actions/publikasi";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, FileText, ExternalLink } from "lucide-react";
import PublikasiForm from "./PublikasiForm";

const prisma = new PrismaClient();

export default async function PublikasiPage() {
    const session = await getServerSession(authOptions);
    
    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session?.user?.id },
        include: {
        publikasi: {
            orderBy: { tahun: 'desc' }
        }
        }
    });

    const publikasiList = profile?.publikasi || [];

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <FileText className="h-6 w-6" />
            </div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Data Publikasi</h2>
            <p className="text-zinc-500">Kelola riwayat publikasi jurnal, prosiding, atau karya tulis Anda.</p>
            </div>
        </div>

        {!profile && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
            <strong>Peringatan:</strong> Anda belum melengkapi data profil. Silakan isi NIDN Anda di menu "Profil Saya" terlebih dahulu sebelum menambahkan publikasi.
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1">
            {profile && <PublikasiForm />}
            </div>

            <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Judul & Detail</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {publikasiList.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell className="font-bold text-zinc-700 align-top pt-4">{item.tahun}</TableCell>
                    <TableCell className="py-4">
                    <p className="font-medium text-zinc-900 leading-snug">{item.judul}</p>
                        <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-blue-600 font-medium">{item.lokasi}</span>
                        {item.url && (
                            <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center text-xs text-zinc-500 hover:text-blue-600 bg-zinc-100 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors"
                            >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Buka Artikel
                            </a>
                        )}
                        </div>
                        {item.abstrak && (
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2" title={item.abstrak}>
                            {item.abstrak}
                        </p>
                        )}
                    </TableCell>
                    <TableCell className="text-right align-top pt-4">
                        <form action={deletePublikasi.bind(null, item.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Hapus Publikasi">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </form>
                    </TableCell>
                    </TableRow>
                ))}
                {publikasiList.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={3} className="text-center text-zinc-500 h-32">
                        Belum ada data publikasi yang ditambahkan.
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