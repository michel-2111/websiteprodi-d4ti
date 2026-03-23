"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createPengabdian(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const judul = formData.get("judul") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const file = formData.get("gambar") as File | null;

    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) throw new Error("Lengkapi profil NIDN terlebih dahulu.");

    let gambarUrl = null;
    if (file && file.size > 0) {
        gambarUrl = await uploadFileToSupabase(file, 'pengabdian');
    }

    await prisma.pengabdian.create({
        data: {
        dosenProfileId: profile.id,
        judul,
        tahun,
        gambarUrl,
        }
    });

    revalidatePath("/dosen/pengabdian");
    }

    export async function deletePengabdian(id: string) {
    await prisma.pengabdian.delete({ where: { id } });
    revalidatePath("/dosen/pengabdian");
}