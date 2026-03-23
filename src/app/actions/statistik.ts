"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function upsertStatistik(formData: FormData) {
    const tahun = parseInt(formData.get("tahun") as string);
    const pendaftar = parseInt(formData.get("pendaftar") as string);
    const diterima = parseInt(formData.get("diterima") as string);
    const lulusan = parseInt(formData.get("lulusan") as string);

    try {
        await prisma.statistikMahasiswa.upsert({
        where: { tahun },
        update: {
            pendaftar,
            diterima,
            lulusan,
        },
        create: {
            tahun,
            pendaftar,
            diterima,
            lulusan,
        },
        });

        revalidatePath("/admin/statistik");
        revalidatePath("/");
    } catch (error) {
        console.error("Gagal menyimpan statistik:", error);
        throw new Error("Terjadi kesalahan saat menyimpan data statistik.");
    }
    }

    export async function deleteStatistik(id: string) {
    await prisma.statistikMahasiswa.delete({
        where: { id },
    });
    revalidatePath("/admin/statistik");
}