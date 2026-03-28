"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function catatKunjungan() {
    try {
        await prisma.pengunjung.upsert({
            where: { id: "global" },
            update: { total: { increment: 1 } },
            create: { id: "global", total: 1 }
        });
        
        console.log("Kunjungan baru berhasil dicatat!");
        
        revalidatePath("/"); 
        
    } catch (error) {
        console.error("Gagal mencatat pengunjung:", error);
    }
}