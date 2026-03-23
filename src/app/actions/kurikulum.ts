"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createKurikulum(formData: FormData) {
    const nama = formData.get("nama") as string;
    const tahunMulai = parseInt(formData.get("tahunMulai") as string);
    const deskripsi = formData.get("deskripsi") as string;
    const file = formData.get("dokumen") as File | null;

    let dokumenUrl = null;

    if (file && file.size > 0) {
        dokumenUrl = await uploadFileToSupabase(file, 'kurikulum');
    }

    await prisma.kurikulum.create({
        data: {
        nama,
        tahunMulai,
        deskripsi,
        dokumenUrl,
        aktif: false,
        }
    });

    revalidatePath("/admin/kurikulum");
    redirect("/admin/kurikulum");
    }

    export async function setKurikulumAktif(id: string) {
    await prisma.kurikulum.updateMany({
        data: { aktif: false }
    });

    await prisma.kurikulum.update({
        where: { id },
        data: { aktif: true }
    });

    revalidatePath("/admin/kurikulum");
    revalidatePath("/");
    }

    export async function deleteKurikulum(id: string) {
    await prisma.kurikulum.delete({
        where: { id }
    });
    revalidatePath("/admin/kurikulum");
}