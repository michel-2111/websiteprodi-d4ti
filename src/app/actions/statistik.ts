"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveProdiId } from "./prodi-context";

const prisma = new PrismaClient();

// 1. READ: Ambil statistik khusus prodi yang aktif
export async function getStatistik() {
    const prodiId = await getActiveProdiId();
    if (!prodiId) return [];

    try {
        return await prisma.statistikMahasiswa.findMany({
            where: { prodiId: prodiId },
            orderBy: { tahun: 'desc' } // Urutkan dari tahun terbaru
        });
    } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
        return [];
    }
}

// 2. UPSERT: Buat baru jika tahun belum ada, Update jika tahun sudah ada di prodi tersebut
export async function upsertStatistik(formData: FormData) {
    const prodiId = await getActiveProdiId();
    if (!prodiId) {
        throw new Error("Prodi ID tidak ditemukan. Silakan pilih prodi terlebih dahulu.");
    }

    const tahun = parseInt(formData.get("tahun") as string);
    const pendaftar = parseInt(formData.get("pendaftar") as string);
    const diterima = parseInt(formData.get("diterima") as string);
    const lulusan = parseInt(formData.get("lulusan") as string);

    try {
        await prisma.statistikMahasiswa.upsert({
            where: {
                tahun_prodiId: {
                    tahun: tahun,
                    prodiId: prodiId
                }
            },
            update: {
                pendaftar,
                diterima,
                lulusan
            },
            create: {
                tahun,
                pendaftar,
                diterima,
                lulusan,
                prodiId: prodiId
            }
        });

        revalidatePath("/admin/statistik");
    } catch (error) {
        console.error("Gagal menyimpan statistik:", error);
        throw new Error("Gagal menyimpan data statistik.");
    }
}

// 3. DELETE
export async function deleteStatistik(id: string) {
    try {
        await prisma.statistikMahasiswa.delete({ where: { id } });
        revalidatePath("/admin/statistik");
    } catch (error) {
        console.error("Gagal menghapus statistik:", error);
        throw new Error("Gagal menghapus data statistik.");
    }
}