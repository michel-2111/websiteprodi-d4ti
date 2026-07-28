"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/src/lib/supabase";

const prisma = new PrismaClient();

export async function submitAlihJenjang(formData: FormData) {
    try {
        console.log("=== MEMULAI PROSES SUBMIT ALIH JENJANG ===");
        
        const nama = formData.get("nama") as string;
        const telepon = formData.get("telepon") as string;
        const alamat = formData.get("alamat") as string;
        const prodiId = formData.get("prodiId") as string;

        const ktpFile = formData.get("ktp") as File | null;
        const pasfotoFile = formData.get("pasfoto") as File | null;
        const ijazahFile = formData.get("ijazah") as File | null;
        const cvFile = formData.get("cv") as File | null;

        console.log("Data teks diterima:", { nama, telepon, prodiId });
        console.log("Ukuran file KTP (bytes):", ktpFile?.size);

        if (!nama || !telepon || !alamat || !prodiId) {
            return { success: false, error: "Data teks wajib diisi." };
        }

        // 🔍 DEBUG: Cek proses upload satu per satu untuk melihat file mana yang gagal
        console.log("Mengunggah KTP...");
        const ktpUrl = await uploadFileToSupabase(ktpFile!, 'alih-jenjang').catch(e => { console.error("KTP Error:", e); return null; });
        console.log("KTP URL Result:", ktpUrl);

        console.log("Mengunggah Pasfoto...");
        const pasfotoUrl = await uploadFileToSupabase(pasfotoFile!, 'alih-jenjang').catch(e => { console.error("Pasfoto Error:", e); return null; });
        console.log("Pasfoto URL Result:", pasfotoUrl);

        console.log("Mengunggah Ijazah...");
        const ijazahUrl = await uploadFileToSupabase(ijazahFile!, 'alih-jenjang').catch(e => { console.error("Ijazah Error:", e); return null; });
        console.log("Ijazah URL Result:", ijazahUrl);

        console.log("Mengunggah CV...");
        const cvUrl = await uploadFileToSupabase(cvFile!, 'alih-jenjang').catch(e => { console.error("CV Error:", e); return null; });
        console.log("CV URL Result:", cvUrl);

        if (!ktpUrl || !pasfotoUrl || !ijazahUrl || !cvUrl) {
            console.error("❌ Gagal karena salah satu atau semua URL file bernilai null!");
            return { success: false, error: "Gagal mengunggah salah satu berkas persyaratan ke Supabase. Periksa nama bucket Anda." };
        }

        console.log("Menyimpan ke database via Prisma...");
        const record = await prisma.alihJenjang.create({
            data: {
                nama,
                telepon,
                alamat,
                prodiId,
                ktpUrl,
                pasfotoUrl,
                ijazahUrl,
                cvUrl
            }
        });

        console.log("✅ Berhasil menyimpan ke database:", record.id);
        revalidatePath("/admin/alih-jenjang");
        return { success: true, data: record };

    } catch (error) {
        console.error("❌ CRITICAL ERROR PADA SERVER ACTION:", error);
        return { success: false, error: "Terjadi kesalahan internal server." };
    }
}