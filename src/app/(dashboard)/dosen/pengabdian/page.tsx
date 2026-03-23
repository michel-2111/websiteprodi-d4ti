import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deletePengabdian } from "@/src/app/actions/pengabdian";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, HeartHandshake } from "lucide-react";
import PengabdianForm from "./PengabdianForm";

const prisma = new PrismaClient();

export default async function PengabdianPage() {
    const session = await getServerSession(authOptions);
    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session?.user?.id },
        include: { pengabdian: { orderBy: { tahun: 'desc' } } }
    });

    const list = profile?.pengabdian || [];

    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><HeartHandshake className="h-6 w-6" /></div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Pengabdian Masyarakat</h2>
            <p className="text-zinc-500">Rekam jejak kontribusi sosial dan pengabdian Anda.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">{profile && <PengabdianForm />}</div>
            <div className="md:col-span-2 rounded-md border bg-white">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead className="w-[100px]">Tahun</TableHead>
                    <TableHead>Judul Kegiatan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {list.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell>
                        {item.gambarUrl ? (
                        <img src={item.gambarUrl} className="h-12 w-16 object-cover rounded border" alt="dok" />
                        ) : <span className="text-xs italic text-zinc-400">N/A</span>}
                    </TableCell>
                    <TableCell className="font-bold">{item.tahun}</TableCell>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell className="text-right">
                        <form action={deletePengabdian.bind(null, item.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </form>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </div>
        </div>
    );
}