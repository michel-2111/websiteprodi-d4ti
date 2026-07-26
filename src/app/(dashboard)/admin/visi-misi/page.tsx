import { PrismaClient } from "@prisma/client";
import VisiMisiClient from "./VisiMisiClient";
import { getActiveProdiId } from "@/src/app/actions/prodi-context"; // Import pembaca cookie prodi

const prisma = new PrismaClient();

export const revalidate = 0;

export default async function AdminVisiMisiPage() {
    // 1. Ambil ID prodi yang sedang dikelola admin
    const activeProdiId = await getActiveProdiId();
    
    // 2. Ambil informasi nama prodi untuk teks dinamis
    const prodiAktif = activeProdiId 
        ? await prisma.prodi.findUnique({ where: { id: activeProdiId } })
        : null;

    // 3. Filter data Visi Misi HANYA untuk prodi tersebut
    const visiMisiData = await prisma.visiMisi.findMany({
        where: { prodiId: activeProdiId }, // <-- Filter Multi-Tenancy
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <VisiMisiClient 
                initialData={visiMisiData} 
                namaProdi={prodiAktif ? prodiAktif.nama : "Program Studi"} 
            />
        </div>
    );
}