"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createCPL(formData: FormData) {
    const kurikulumId = formData.get("kurikulumId") as string;
    const kode = formData.get("kode") as string;
    const deskripsi = formData.get("deskripsi") as string;

    try {
        await prisma.cPL.create({
            data: {
                kurikulumId,
                kode,
                deskripsi,
            },
        });
        
        revalidatePath(`/admin/kurikulum/${kurikulumId}/cpl`);
    } catch (error) {
        console.error("Gagal menambah CPL:", error);
        throw new Error("Gagal menambah data CPL.");
    }
}

export async function deleteCPL(id: string, kurikulumId: string) {
    await prisma.cPL.delete({
        where: { id },
    });
    revalidatePath(`/admin/kurikulum/${kurikulumId}/cpl`);
}