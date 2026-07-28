import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import FormAlihJenjang from "./FormAlihJenjang"; // Komponen Client Form

const prisma = new PrismaClient();

export default async function AlihJenjangPage({ 
    params 
}: { 
    params: Promise<{ prodi: string }> 
}) {
    const { prodi: slug } = await params;

    // Cek apakah prodi valid dan merupakan D4 TI / D4 Teknik Listrik
    const prodiAktif = await prisma.prodi.findUnique({
        where: { slug }
    });

    const isAllowed = slug.includes("d4-ti") || slug.includes("d4-teknik-informatika") || slug.includes("d4-teknik-listrik") || slug.includes("d4-tl");

    if (!prodiAktif || !isAllowed) return notFound();

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">
                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Pendaftaran Alih Jenjang</h1>
                <p className="text-zinc-500 mb-6">Program Studi {prodiAktif.nama}</p>
                
                {/* Panggil Komponen Client Form di sini */}
                <FormAlihJenjang prodiId={prodiAktif.id} />
            </div>
        </div>
    );
}