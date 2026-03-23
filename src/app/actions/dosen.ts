"use server";

import { PrismaClient, Pangkat, JabatanFungsional } from "@prisma/client"; // Tambahkan import Enum
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function upsertProfilDosen(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const userId = session.user.id;
    
    // 1. Ambil data teks biasa
    const nidn = formData.get("nidn") as string;
    const email = formData.get("email") as string;
    const telepon = formData.get("telepon") as string;
    
    // 2. Ambil data Enum (Ubah string kosong menjadi null agar Prisma tidak error)
    const pangkatRaw = formData.get("pangkat") as string;
    const pangkat = pangkatRaw ? (pangkatRaw as Pangkat) : null;
    
    const jabatanRaw = formData.get("jabatanFungsional") as string;
    const jabatanFungsional = jabatanRaw ? (jabatanRaw as JabatanFungsional) : null;

    // 3. Ambil dan format array kompetensi
    const kompetensiRaw = formData.get("kompetensi") as string;
    const kompetensi = kompetensiRaw.split(",").map(k => k.trim()).filter(k => k !== "");
    
    // 4. Ambil file foto
    const file = formData.get("foto") as File | null;

    try {
        const existingProfile = await prisma.dosenProfile.findUnique({
            where: { userId }
        });

        let fotoUrl = existingProfile?.fotoUrl || null;

        if (file && file.size > 0) {
            fotoUrl = await uploadFileToSupabase(file, 'dosen');
        }

        // 5. Simpan ke Database
        await prisma.dosenProfile.upsert({
            where: { userId },
            update: {
                nidn,
                email,
                telepon,
                pangkat,
                jabatanFungsional,
                kompetensi,
                ...(fotoUrl && { fotoUrl }) // Hanya update fotoUrl jika ada file baru
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
    } catch (error) {
        console.error("Gagal menyimpan profil:", error);
        throw new Error("Gagal menyimpan profil. Pastikan NIDN tidak duplikat.");
    }
}