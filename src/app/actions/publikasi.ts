"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

const prisma = new PrismaClient();

export async function createPublikasi(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const judul = formData.get("judul") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const lokasi = formData.get("lokasi") as string;
    const abstrak = formData.get("abstrak") as string;
    const url = formData.get("url") as string;

    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) {
        throw new Error("Silakan lengkapi NIDN dan Profil Anda terlebih dahulu.");
    }

    await prisma.publikasi.create({
        data: {
        dosenProfileId: profile.id,
        judul,
        tahun,
        lokasi,
        abstrak,
        url: url ? url : null,
        }
    });

    revalidatePath("/dosen/publikasi");
    }

    export async function deletePublikasi(id: string) {
    await prisma.publikasi.delete({
        where: { id }
    });
    revalidatePath("/dosen/publikasi");
}