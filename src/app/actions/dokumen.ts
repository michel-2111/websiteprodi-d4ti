"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/src/lib/supabase";
import { getActiveProdiId } from "./prodi-context"; // 1. Import cookie prodi context

const prisma = new PrismaClient();

// 2. READ: Ambil dokumen prodi aktif + dokumen global jurusan (prodiId: null)
export async function getDokumen() {
    const prodiId = await getActiveProdiId();
    
    try {
        return await prisma.dokumen.findMany({
            where: {
                OR: [
                    { prodiId: prodiId }, // Dokumen spesifik prodi yang aktif dikelola
                    { prodiId: null }     // Dokumen tingkat jurusan (global)
                ]
            },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Gagal mengambil data dokumen:", error);
        return [];
    }
}

// 3. CREATE: Simpan dokumen otomatis terikat ke prodi yang aktif di switcher
export async function createDokumen(formData: FormData) {
    const prodiId = await getActiveProdiId();
    if (!prodiId) {
        throw new Error("Prodi ID tidak ditemukan. Silakan pilih prodi terlebih dahulu.");
    }

    const nama = formData.get("nama") as string;
    const keterangan = formData.get("keterangan") as string;
    const file = formData.get("file") as File;

    if (!file || file.size === 0) throw new Error("File dokumen wajib diunggah.");

    try {
        const fileUrl = await uploadFileToSupabase(file, 'dokumen');

        await prisma.dokumen.create({
            data: { 
                nama, 
                keterangan, 
                fileUrl,
                prodiId: prodiId // Simpan dengan keterikatan prodi aktif
            }
        });

        revalidatePath("/admin/dokumen");
        revalidatePath("/dosen/dokumen");
    } catch (error) {
        console.error("Gagal membuat dokumen:", error);
        throw new Error("Gagal menyimpan dokumen baru.");
    }
}

export async function updateDokumen(formData: FormData) {
    const id = formData.get("id") as string;
    const nama = formData.get("nama") as string;
    const keterangan = formData.get("keterangan") as string;
    const file = formData.get("file") as File | null;

    const dataToUpdate: any = { nama, keterangan };

    try {
        if (file && file.size > 0) {
            dataToUpdate.fileUrl = await uploadFileToSupabase(file, 'dokumen');
        }

        await prisma.dokumen.update({
            where: { id },
            data: dataToUpdate
        });

        revalidatePath("/admin/dokumen");
        revalidatePath("/dosen/dokumen");
    } catch (error) {
        console.error("Gagal memperbarui dokumen:", error);
        throw new Error("Gagal memperbarui dokumen.");
    }
}

export async function deleteDokumen(id: string) {
    try {
        await prisma.dokumen.delete({ where: { id } });
        revalidatePath("/admin/dokumen");
        revalidatePath("/dosen/dokumen");
    } catch (error) {
        console.error("Gagal menghapus dokumen:", error);
        throw new Error("Gagal menghapus dokumen.");
    }
}