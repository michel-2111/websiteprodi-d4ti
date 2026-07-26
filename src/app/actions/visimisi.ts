"use server";

import { PrismaClient, TipeVisiMisi } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveProdiId } from "./prodi-context"; // 1. Import cookie prodi context

const prisma = new PrismaClient();

export async function upsertVisiMisi(formData: FormData) {
    // Ambil ID prodi yang sedang aktif dikelola admin
    const prodiId = await getActiveProdiId();
    if (!prodiId) {
        throw new Error("Prodi ID tidak ditemukan. Silakan pilih prodi terlebih dahulu.");
    }

    const tipe = formData.get("tipe") as TipeVisiMisi;
    const konten = formData.get("konten") as string;

    if (!tipe || !konten) throw new Error("Tipe dan konten wajib diisi");

    try {
        // 2. Gunakan compound unique constraint (tipe_prodiId) bawaan Prisma
        await prisma.visiMisi.upsert({
            where: { 
                tipe_prodiId: {
                    tipe: tipe,
                    prodiId: prodiId
                }
            },
            update: { konten },
            create: { 
                tipe, 
                konten, 
                prodiId: prodiId // Ikat data baru ke prodi aktif
            }
        });

        revalidatePath("/admin/visi-misi");
        revalidatePath("/visi-misi");
    } catch (error) {
        console.error("Gagal melakukan upsert Visi Misi:", error);
        throw new Error("Gagal menyimpan data Visi Misi.");
    }
}

export async function deleteVisiMisi(id: string) {
    try {
        await prisma.visiMisi.delete({ where: { id } });
        revalidatePath("/admin/visi-misi");
        revalidatePath("/visi-misi");
    } catch (error) {
        console.error("Gagal menghapus Visi Misi:", error);
        throw new Error("Gagal menghapus data Visi Misi.");
    }
}