"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function ubahPassword(formData: FormData) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        throw new Error("Sesi telah habis. Silakan login kembali.");
    }

    const passwordLama = formData.get("passwordLama") as string;
    const passwordBaru = formData.get("passwordBaru") as string;
    const konfirmasiPassword = formData.get("konfirmasiPassword") as string;

    if (passwordBaru !== konfirmasiPassword) {
        throw new Error("Password baru dan konfirmasi tidak cocok!");
    }

    if (passwordBaru.length < 6) {
        throw new Error("Password baru minimal terdiri dari 6 karakter.");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user || !user.password) {
        throw new Error("Pengguna tidak ditemukan.");
    }

    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) {
        throw new Error("Password lama Anda salah!");
    }

    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}