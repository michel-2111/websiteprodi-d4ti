import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * @param file
 * @param folder
 * @returns
 */
export async function uploadFileToSupabase(file: File, folder: string): Promise<string> {
    try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
        .from('prodi-files')
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        throw error;
    }

    const { data: publicUrlData } = supabase.storage
        .from('prodi-files')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Gagal mengunggah file ke server penyimpanan.");
    }
}

export async function uploadMultipleFilesToSupabase(files: File[], folder: string): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(file => uploadFileToSupabase(file, folder));
    
    const publicUrls = await Promise.all(uploadPromises);
    
    return publicUrls;
}