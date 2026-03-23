"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createSertifikat(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const namaPelatihan = formData.get("namaPelatihan") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const file = formData.get("dokumen") as File | null;

    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) throw new Error("Lengkapi profil NIDN terlebih dahulu.");

    let dokumenUrl = null;
    if (file && file.size > 0) {
        dokumenUrl = await uploadFileToSupabase(file, 'sertifikat');
    }

    await prisma.sertifikat.create({
        data: {
        dosenProfileId: profile.id,
        namaPelatihan,
        tahun,
        dokumenUrl,
        }
    });

    revalidatePath("/dosen/sertifikat");
    }

    export async function deleteSertifikat(id: string) {
    await prisma.sertifikat.delete({ where: { id } });
    revalidatePath("/dosen/sertifikat");
}