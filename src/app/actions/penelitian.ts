"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createPenelitian(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const judul = formData.get("judul") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const file = formData.get("gambar") as File | null;

    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) {
        throw new Error("Silakan lengkapi NIDN dan Profil Anda terlebih dahulu di menu Profil Saya.");
    }

    let gambarUrl = null;
    if (file && file.size > 0) {
        gambarUrl = await uploadFileToSupabase(file, 'penelitian');
    }

    await prisma.penelitian.create({
        data: {
        dosenProfileId: profile.id,
        judul,
        tahun,
        gambarUrl,
        }
    });

    revalidatePath("/dosen/penelitian");
    }

    export async function deletePenelitian(id: string) {
    await prisma.penelitian.delete({
        where: { id }
    });
    revalidatePath("/dosen/penelitian");
}