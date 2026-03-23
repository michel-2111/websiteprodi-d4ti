"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

const prisma = new PrismaClient();

export async function createHki(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) throw new Error("Lengkapi profil NIDN terlebih dahulu.");

    const kategori = formData.get("kategori") as string;
    const judul = formData.get("judul") as string;
    const link = formData.get("link") as string;
    
    const tahunRaw = formData.get("tahun") as string;
    const tahun = tahunRaw ? parseInt(tahunRaw) : null; 
    
    const anggotaIds = formData.getAll("anggotaIds") as string[];
    const anggotaConnect = anggotaIds.map(id => ({ id }));

    await prisma.hki.create({
        data: {
            kategori,
            judul,
            tahun,
            link,
            ketuaId: profile.id,
            anggota: {
                connect: anggotaConnect
            }
        }
    });

    revalidatePath("/dosen/hki");
}

export async function deleteHki(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    await prisma.hki.delete({ where: { id } });
    revalidatePath("/dosen/hki");
}