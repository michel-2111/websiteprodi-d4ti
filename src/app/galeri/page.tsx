import { PrismaClient } from "@prisma/client";
import GaleriClient from "./GaleriClient";

const prisma = new PrismaClient();
export const revalidate = 60;

export default async function GaleriPage() {
    const [fasilitasList, aktifitasList] = await Promise.all([
        prisma.fasilitas.findMany({ orderBy: { nama: 'asc' } }),
        prisma.aktifitas.findMany({ orderBy: { tanggal: 'desc' } })
    ]);

    return <GaleriClient fasilitasList={fasilitasList} aktifitasList={aktifitasList} />;
}