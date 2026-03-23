"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";
import { uploadMultipleFilesToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createPenelitian(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const ketuaProfile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!ketuaProfile) {
        throw new Error("Profil Anda belum lengkap. Silakan isi profil dosen terlebih dahulu.");
    }

    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const anggotaIds = formData.getAll("anggotaIds") as string[];

    const files = formData.getAll("gambar") as File[];
    const validFiles = files.filter(file => file.size > 0);

    let gambarUrls: string[] = [];
    
    if (validFiles.length > 0) {
        gambarUrls = await uploadMultipleFilesToSupabase(validFiles, 'penelitian');
    }

    const anggotaConnect = anggotaIds.map(id => ({ id }));

    await prisma.penelitian.create({
        data: {
            judul,
            deskripsi,
            tahun,
            gambarUrls,
            ketuaId: ketuaProfile.id,
            anggota: {
                connect: anggotaConnect
            }
        }
    });

    revalidatePath("/dosen/penelitian");
}

export async function deletePenelitian(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    await prisma.penelitian.delete({
        where: { id }
    });

    revalidatePath("/dosen/penelitian");
}