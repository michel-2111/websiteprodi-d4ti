"use server";

import { PrismaClient, TipeVisiMisi } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function upsertVisiMisi(formData: FormData) {
    const tipe = formData.get("tipe") as TipeVisiMisi;
    const konten = formData.get("konten") as string;

    if (!tipe || !konten) throw new Error("Tipe dan konten wajib diisi");

    await prisma.visiMisi.upsert({
        where: { tipe },
        update: { konten },
        create: { tipe, konten }
    });

    revalidatePath("/admin/visi-misi");
    revalidatePath("/visi-misi");
}

export async function deleteVisiMisi(id: string) {
    await prisma.visiMisi.delete({ where: { id } });
    revalidatePath("/admin/visi-misi");
    revalidatePath("/visi-misi");
}