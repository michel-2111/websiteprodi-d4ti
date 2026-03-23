"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as "ADMIN" | "DOSEN" | "GKM";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        });

        revalidatePath("/admin/users");
    } catch (error) {
        console.error("Gagal membuat user:", error);
        throw new Error("Gagal membuat user. Pastikan email belum terdaftar.");
    }
    
    redirect("/admin/users");
}