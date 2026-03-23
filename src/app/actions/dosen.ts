"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function upsertProfilDosen(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const userId = session.user.id;
    const nidn = formData.get("nidn") as string;
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
            kompetensi,
            ...(fotoUrl && { fotoUrl })
        },
        create: {
            userId,
            nidn,
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