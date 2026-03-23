import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import ProfilForm from "./ProfilForm";

const prisma = new PrismaClient();

export default async function DosenProfilePage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    const profil = await prisma.dosenProfile.findUnique({
        where: { userId },
        include: { user: true }
    });

    return (
        <div className="max-w-3xl space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Profil Dosen</h2>
            <p className="text-zinc-500">Lengkapi data diri Anda untuk ditampilkan pada halaman publik.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sisi Kiri: Preview Foto */}
            <div className="md:col-span-1 space-y-4">
            <div className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 bg-white flex flex-col items-center justify-center overflow-hidden">
                {profil?.fotoUrl ? (
                <img src={profil.fotoUrl} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : (
                <span className="text-sm text-zinc-400">Belum ada foto</span>
                )}
            </div>
            <div className="text-center">
                <h3 className="font-semibold">{session?.user?.name}</h3>
                <p className="text-sm text-zinc-500">{profil?.nidn || "NIDN belum diatur"}</p>
            </div>
            </div>

            {/* Sisi Kanan: Form Data */}
            <div className="md:col-span-2 bg-white border rounded-xl p-6">
            {/* Panggil form klien di sini dan lemparkan data profil yang didapat dari server */}
            <ProfilForm profilInfo={profil} />
            </div>
        </div>
        </div>
    );
}