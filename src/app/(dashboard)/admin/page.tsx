import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
    const [totalDosen, kurikulumAktif, totalFasilitas] = await Promise.all([
        prisma.user.count({
        where: { role: "DOSEN" }
        }),
        
        prisma.kurikulum.findFirst({
        where: { aktif: true },
        select: { nama: true }
        }),

        prisma.fasilitas.count()
    ]);

    return (
        <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, Admin</h2>
            <p className="text-zinc-500">Berikut adalah ringkasan data sistem informasi Prodi D4 TI.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalDosen}</div>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kurikulum Aktif</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {kurikulumAktif ? kurikulumAktif.nama : "Belum Ada"}
                </div>
            </CardContent>
            </Card>
            
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fasilitas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalFasilitas}</div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}