"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

const prisma = new PrismaClient();

export async function createBukuAjar(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const profile = await prisma.dosenProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) throw new Error("Lengkapi profil NIDN terlebih dahulu.");

    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const tahun = parseInt(formData.get("tahun") as string);
    const link = formData.get("link") as string;
    
    const anggotaIds = formData.getAll("anggotaIds") as string[];
    const anggotaConnect = anggotaIds.map(id => ({ id }));

    await prisma.bukuAjar.create({
        data: {
            judul,
            deskripsi,
            tahun,
            link,
            ketuaId: profile.id,
            anggota: {
                connect: anggotaConnect
            }
        }
    });

    revalidatePath("/dosen/buku");
}

export async function deleteBukuAjar(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    await prisma.bukuAjar.delete({ where: { id } });
    revalidatePath("/dosen/buku");
}