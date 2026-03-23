"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function createLaporan(formData: FormData) {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "GKM") {
        throw new Error("Unauthorized. Hanya GKM yang dapat mengunggah laporan.");
    }

    const judul = formData.get("judul") as string;
    const semester = formData.get("semester") as string;
    const dokumenFile = formData.get("dokumen") as File;
    
    const dokumentasiFiles = formData.getAll("dokumentasi") as File[];

    if (!dokumenFile || dokumenFile.size === 0) {
        throw new Error("File dokumen PDF wajib diunggah.");
    }

    const dokumenUrl = await uploadFileToSupabase(dokumenFile, 'laporan_gkm');
    
    let dokumentasiUrls: string[] = [];
    if (dokumentasiFiles && dokumentasiFiles.length > 0 && dokumentasiFiles[0].size > 0) {
        const uploadPromises = dokumentasiFiles.map((file) => uploadFileToSupabase(file, 'laporan_gkm_foto'));
        dokumentasiUrls = await Promise.all(uploadPromises);
    }

    await prisma.laporanGkm.create({
        data: {
        judul,
        semester,
        dokumenUrl,
        dokumentasiUrls,
        }
    });

    revalidatePath("/gkm/laporan");
    }

    export async function deleteLaporan(id: string) {
    await prisma.laporanGkm.delete({ where: { id } });
    revalidatePath("/gkm/laporan");
    }