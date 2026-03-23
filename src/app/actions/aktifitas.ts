"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createAktifitas(formData: FormData) {
    const nama = formData.get("nama") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const tanggalRaw = formData.get("tanggal") as string;
    
    const tanggal = tanggalRaw ? new Date(tanggalRaw) : null;
    
    const files = formData.getAll("gambar") as File[];

    if (!files || files.length === 0 || files[0].size === 0) {
        throw new Error("Minimal satu gambar aktifitas wajib diunggah.");
    }

    try {
        const uploadPromises = files.map((file) => uploadFileToSupabase(file, 'aktifitas'));
        const gambarUrls = await Promise.all(uploadPromises);

        await prisma.aktifitas.create({
        data: {
            nama,
            deskripsi,
            tanggal,
            gambarUrls,
        },
        });

        revalidatePath("/admin/aktifitas");
    } catch (error) {
        console.error("Gagal menyimpan aktifitas:", error);
        throw new Error("Gagal menyimpan data aktifitas.");
    }

    redirect("/admin/aktifitas");
    }

    export async function deleteAktifitas(id: string) {
    await prisma.aktifitas.delete({
        where: { id },
    });
    revalidatePath("/admin/aktifitas");
}