"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createDokumen(formData: FormData) {
    const nama = formData.get("nama") as string;
    const keterangan = formData.get("keterangan") as string;
    const file = formData.get("file") as File;

    if (!file || file.size === 0) throw new Error("File dokumen wajib diunggah.");

    const fileUrl = await uploadFileToSupabase(file, 'dokumen');

    await prisma.dokumen.create({
        data: { nama, keterangan, fileUrl }
    });

    revalidatePath("/admin/dokumen");
    revalidatePath("/dosen/dokumen");
}

export async function updateDokumen(formData: FormData) {
    const id = formData.get("id") as string;
    const nama = formData.get("nama") as string;
    const keterangan = formData.get("keterangan") as string;
    const file = formData.get("file") as File | null;

    const dataToUpdate: any = { nama, keterangan };

    if (file && file.size > 0) {
        dataToUpdate.fileUrl = await uploadFileToSupabase(file, 'dokumen');
    }

    await prisma.dokumen.update({
        where: { id },
        data: dataToUpdate
    });

    revalidatePath("/admin/dokumen");
    revalidatePath("/dosen/dokumen");
}

export async function deleteDokumen(id: string) {
    await prisma.dokumen.delete({ where: { id } });
    revalidatePath("/admin/dokumen");
    revalidatePath("/dosen/dokumen");
}