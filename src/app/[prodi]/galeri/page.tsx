import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation"; // Import untuk pengamanan 404
import GaleriClient from "./GaleriClient";

const prisma = new PrismaClient();
export const revalidate = 60;

// 1. Terima parameter prodi dari URL secara asinkron (standar Next.js 15+)
export default async function GaleriPage({ 
    params 
}: { 
    params: Promise<{ prodi: string }> 
}) {
    const resolvedParams = await params;
    const { prodi: slug } = resolvedParams;

    // 2. Ambil data prodi aktif untuk mendapatkan ID-nya
    const prodiAktif = await prisma.prodi.findUnique({
        where: { slug }
    });

    if (!prodiAktif) return notFound();

    // 3. Saring pengambilan data fasilitas dan aktifitas berdasarkan prodiId
    const [fasilitasList, aktifitasList] = await Promise.all([
        prisma.fasilitas.findMany({ 
            where: { prodiId: prodiAktif.id }, // <-- Filter Multi-Tenancy
            orderBy: { nama: 'asc' } 
        }),
        prisma.aktifitas.findMany({ 
            where: { prodiId: prodiAktif.id }, // <-- Filter Multi-Tenancy
            orderBy: { tanggal: 'desc' } 
        })
    ]);

    // 4. Kirimkan currentSlug ke GaleriClient untuk mengamankan link internal detail
    return (
        <GaleriClient 
            fasilitasList={fasilitasList} 
            aktifitasList={aktifitasList} 
            currentSlug={slug} 
        />
    );
}