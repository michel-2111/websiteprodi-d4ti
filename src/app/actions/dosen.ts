"use server";

import { PrismaClient, Pangkat, JabatanFungsional } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";
import { getActiveProdiId } from "./prodi-context"; // 1. Import cookie prodi context

const prisma = new PrismaClient();

// 2. READ: Fungsi baru untuk dipanggil di halaman Admin Data Dosen
export async function getDosenByProdi() {
    const prodiId = await getActiveProdiId();
    if (!prodiId) return [];

    try {
        // Ambil data User yang memiliki role DOSEN dan terikat prodiId aktif, 
        // sertakan pula data DosenProfile-nya
        return await prisma.user.findMany({
            where: {
                role: "DOSEN",
                prodiId: prodiId,
            },
            include: {
                dosenProfile: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    } catch (error) {
        console.error("Gagal mengambil data dosen berdasarkan prodi:", error);
        return [];
    }
}

// 3. UPSERT: Tetap dipertahankan untuk kebutuhan Portal Mandiri Dosen
export async function upsertProfilDosen(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const userId = session.user.id;
    
    const nidn = formData.get("nidn") as string;
    const email = formData.get("email") as string;
    const telepon = formData.get("telepon") as string;
    
    const pangkatRaw = formData.get("pangkat") as string;
    const pangkat = pangkatRaw ? (pangkatRaw as Pangkat) : null;
    
    const jabatanRaw = formData.get("jabatanFungsional") as string;
    const jabatanFungsional = jabatanRaw ? (jabatanRaw as JabatanFungsional) : null;

    const kompetensiRaw = formData.get("kompetensi") as string;
    const kompetensi = kompetensiRaw.split(",").map(k => k.trim()).filter(k => k !== "");
    
    const file = formData.get("foto") as File | null;

    try {
        const existingProfile = await prisma.dosenProfile.findUnique({
            where: { userId }
        });

        let fotoUrl = existingProfile?.fotoUrl || null;

        if (file && file.size > 0) {
            fotoUrl = await uploadFileToSupabase(file, 'dosen');
        }

        await prisma.dosenProfile.upsert({
            where: { userId },
            update: {
                nidn,
                email,
                telepon,
                pangkat,
                jabatanFungsional,
                kompetensi,
                ...(fotoUrl && { fotoUrl })
            },
            create: {
                userId,
                nidn,
                email,
                telepon,
                pangkat,
                jabatanFungsional,
                kompetensi,
                fotoUrl,
            }
        });

        revalidatePath("/dosen");
        revalidatePath("/admin/data-dosen"); // Revalidate juga halaman adminnya
    } catch (error) {
        console.error("Gagal menyimpan profil:", error);
        throw new Error("Gagal menyimpan profil. Pastikan NIDN tidak duplikat.");
    }
}