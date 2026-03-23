"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createMataKuliah(formData: FormData) {
    const kurikulumId = formData.get("kurikulumId") as string;
    const kodeMk = formData.get("kodeMk") as string;
    const nama = formData.get("nama") as string;
    const sks = parseInt(formData.get("sks") as string);
    const semester = parseInt(formData.get("semester") as string);
    const jenis = formData.get("jenis") as string;
    const deskripsi = formData.get("deskripsi") as string;

    try {
        await prisma.mataKuliah.create({
        data: {
            kurikulumId,
            kodeMk,
            nama,
            sks,
            semester,
            jenis,
            deskripsi,
        },
        });
        
        revalidatePath(`/admin/kurikulum/${kurikulumId}/matakuliah`);
    } catch (error) {
        console.error("Gagal menambah mata kuliah:", error);
        throw new Error("Gagal menambah data. Pastikan Kode MK tidak duplikat di kurikulum ini.");
    }
    }

    export async function deleteMataKuliah(id: string, kurikulumId: string) {
    await prisma.mataKuliah.delete({
        where: { id },
    });
    revalidatePath(`/admin/kurikulum/${kurikulumId}/matakuliah`);
}