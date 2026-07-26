"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileToSupabase } from "@/src/lib/supabase";
import { getActiveProdiId } from "./prodi-context"; // 1. Import action cookie prodi

const prisma = new PrismaClient();

// 2. READ: Ambil data kurikulum berdasarkan prodi yang sedang aktif
export async function getKurikulum() {
    const prodiId = await getActiveProdiId();
    if (!prodiId) return [];

    try {
        return await prisma.kurikulum.findMany({
            where: { prodiId: prodiId },
            orderBy: { tahunMulai: 'desc' } // Urutkan dari tahun terbaru
        });
    } catch (error) {
        console.error("Gagal mengambil data kurikulum:", error);
        return [];
    }
}

// 3. CREATE: Simpan kurikulum dengan prodiId
export async function createKurikulum(formData: FormData) {
    const prodiId = await getActiveProdiId();
    if (!prodiId) {
        throw new Error("Prodi ID tidak ditemukan. Silakan pilih prodi terlebih dahulu.");
    }

    const nama = formData.get("nama") as string;
    const tahunMulai = parseInt(formData.get("tahunMulai") as string);
    const deskripsi = formData.get("deskripsi") as string;
    const file = formData.get("dokumen") as File | null;

    let dokumenUrl = null;

    if (file && file.size > 0) {
        dokumenUrl = await uploadFileToSupabase(file, 'kurikulum');
    }

    try {
        await prisma.kurikulum.create({
            data: {
                nama,
                tahunMulai,
                deskripsi,
                dokumenUrl,
                aktif: false,
                prodiId: prodiId, // Ikat ke prodi aktif
            }
        });

        revalidatePath("/admin/kurikulum");
    } catch (error) {
        console.error("Gagal menyimpan kurikulum:", error);
        throw new Error("Gagal menyimpan data kurikulum.");
    }
    
    redirect("/admin/kurikulum");
}

// 4. UPDATE: Set kurikulum aktif HANYA pada prodi yang bersangkutan
export async function setKurikulumAktif(id: string) {
    try {
        // Cari tahu kurikulum ini milik prodi mana
        const targetKurikulum = await prisma.kurikulum.findUnique({
            where: { id },
            select: { prodiId: true }
        });

        if (!targetKurikulum) throw new Error("Kurikulum tidak ditemukan");

        // Matikan semua kurikulum yang HANYA berada di prodi yang sama
        await prisma.kurikulum.updateMany({
            where: { prodiId: targetKurikulum.prodiId },
            data: { aktif: false }
        });

        // Aktifkan kurikulum yang dipilih
        await prisma.kurikulum.update({
            where: { id },
            data: { aktif: true }
        });

        revalidatePath("/admin/kurikulum");
        revalidatePath("/");
    } catch (error) {
        console.error("Gagal mengubah status kurikulum:", error);
        throw new Error("Gagal mengaktifkan kurikulum.");
    }
}

export async function deleteKurikulum(id: string) {
    try {
        await prisma.kurikulum.delete({
            where: { id }
        });
        revalidatePath("/admin/kurikulum");
    } catch (error) {
        console.error("Gagal menghapus kurikulum:", error);
        throw new Error("Gagal menghapus kurikulum.");
    }
}