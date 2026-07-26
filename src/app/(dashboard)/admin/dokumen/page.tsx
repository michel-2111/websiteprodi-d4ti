import { PrismaClient } from "@prisma/client";
import DokumenClient from "./DokumenClient";
import { getDokumen } from "@/src/app/actions/dokumen"; // 1. Import getDokumen
import { getActiveProdiId } from "@/src/app/actions/prodi-context"; // 2. Import context prodi

const prisma = new PrismaClient();
export const revalidate = 0; 

export default async function AdminDokumenPage() {
    // 3. Gunakan Server Action yang sudah terfilter (Prodi Aktif + Global Jurusan)
    const dokumenList = await getDokumen();

    // 4. Ambil nama prodi aktif untuk teks deskripsi dinamis
    const activeProdiId = await getActiveProdiId();
    const prodiAktif = activeProdiId 
        ? await prisma.prodi.findUnique({ where: { id: activeProdiId } })
        : null;

    return (
        <DokumenClient 
            initialData={dokumenList} 
            namaProdi={prodiAktif ? prodiAktif.nama : "Program Studi"} 
        />
    );
}