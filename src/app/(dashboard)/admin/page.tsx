import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { getActiveProdiId } from "../../actions/prodi-context"; // 1. Import helper cookie yang kita buat di Tahap 1
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
    // 2. Ambil ID prodi yang saat ini sedang dipilih admin via switcher cookie
    const prodiId = await getActiveProdiId();

    // Ambil data detail prodi untuk menampilkan nama prodi di sub-header
    const prodiAktifData = prodiId 
        ? await prisma.prodi.findUnique({ where: { id: prodiId } }) 
        : null;

    // 3. Ambil data statistik dengan menyuntikkan filter prodiId
    const [totalDosen, kurikulumAktif, totalFasilitas] = await Promise.all([
        prisma.user.count({
            where: { 
                role: "DOSEN",
                prodiId: prodiId || undefined // <-- Filter prodi dosen
            }
        }),
        
        prisma.kurikulum.findFirst({
            where: { 
                aktif: true,
                prodiId: prodiId || undefined // <-- Filter prodi kurikulum
            },
            select: { nama: true }
        }),

        prisma.fasilitas.count({
            where: { 
                prodiId: prodiId || undefined // <-- Filter prodi fasilitas
            }
        })
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, Admin</h2>
                {/* 4. Buat sub-header menjadi dinamis sesuai prodi aktif */}
                <p className="text-zinc-500">
                    Berikut adalah ringkasan data sistem informasi {prodiAktifData ? prodiAktifData.nama : "Program Studi"}.
                </p>
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