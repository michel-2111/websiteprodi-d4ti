"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createFasilitas(formData: FormData) {
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
  await prisma.fasilitas.delete({
    where: { id },
  });
  revalidatePath("/admin/fasilitas");
}