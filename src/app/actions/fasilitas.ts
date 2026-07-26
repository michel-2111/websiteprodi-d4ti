"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileToSupabase } from "@/src/lib/supabase";
import { getActiveProdiId } from "./prodi-context"; // 1. Import context prodi

const prisma = new PrismaClient();

// 2. READ: Ambil data fasilitas berdasarkan prodi yang sedang aktif
export async function getFasilitas() {
  const prodiId = await getActiveProdiId();
  if (!prodiId) return [];

  try {
    return await prisma.fasilitas.findMany({
      where: {
        prodiId: prodiId, // Filter khusus prodi ini
      },
    });
  } catch (error) {
    console.error("Gagal mengambil data fasilitas:", error);
    return [];
  }
}

// 3. CREATE: Simpan fasilitas baru
export async function createFasilitas(formData: FormData) {
  // Ambil ID prodi yang sedang dipilih admin
  const prodiId = await getActiveProdiId();
  if (!prodiId) {
    throw new Error("Prodi ID tidak ditemukan. Silakan pilih prodi terlebih dahulu.");
  }

  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  
  const files = formData.getAll("gambar") as File[];

  if (!files || files.length === 0 || files[0].size === 0) {
    throw new Error("Minimal satu gambar fasilitas wajib diunggah.");
  }

  try {
    const uploadPromises = files.map((file) => uploadFileToSupabase(file, 'fasilitas'));
    const gambarUrls = await Promise.all(uploadPromises);

    await prisma.fasilitas.create({
      data: {
        nama,
        deskripsi,
        gambarUrls,
        prodiId: prodiId, // Ikat fasilitas ini ke prodi aktif
      },
    });

    revalidatePath("/admin/fasilitas");
  } catch (error) {
    console.error("Gagal menyimpan fasilitas:", error);
    throw new Error("Gagal menyimpan fasilitas.");
  }

  redirect("/admin/fasilitas");
}

export async function deleteFasilitas(id: string) {
  try {
    await prisma.fasilitas.delete({
      where: { id },
    });
    revalidatePath("/admin/fasilitas");
  } catch (error) {
    console.error("Gagal menghapus fasilitas:", error);
    throw new Error("Gagal menghapus fasilitas.");
  }
}