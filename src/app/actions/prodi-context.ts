"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Ambil semua daftar prodi untuk isi Dropdown
export async function getDaftarProdi() {
    return await prisma.prodi.findMany({
        orderBy: { nama: "asc" },
    });
}

// 2. Ambil ID prodi yang sedang aktif saat ini dari Cookies
export async function getActiveProdiId() {
    const cookieStore = await cookies();
    const activeId = cookieStore.get("active_prodi_id")?.value;

    // Jika belum ada cookie terpasang, ambil prodi pertama sebagai default (D4 TI)
    if (!activeId) {
        const firstProdi = await prisma.prodi.findFirst({
        orderBy: { nama: "asc" },
        });
        return firstProdi?.id || null;
    }

    return activeId;
}

// 3. Aksi ketika Admin mengubah pilihan prodi di Dropdown
export async function setActiveProdiId(id: string) {
    const cookieStore = await cookies();
    cookieStore.set("active_prodi_id", id, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
}