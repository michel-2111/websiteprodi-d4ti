"use server";

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as Role;

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
    } catch (error) {
        console.error("Gagal membuat user:", error);
        throw new Error("Gagal membuat user. Pastikan email belum terdaftar.");
    }
    
    revalidatePath("/admin"); 
    redirect("/admin");
}

export async function updateUser(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as Role;

    try {
        await prisma.user.update({
            where: { id },
            data: { name, email, role }
        });
        
        revalidatePath("/admin"); 
    } catch (error) {
        throw new Error("Gagal memperbarui pengguna. Email mungkin sudah digunakan.");
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });
        
        revalidatePath("/admin"); 
    } catch (error) {
        throw new Error("Gagal menghapus pengguna.");
    }
}