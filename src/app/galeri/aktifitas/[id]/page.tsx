import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Activity, Calendar, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();
export const revalidate = 60;

function isImage(url: string) {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

export default async function AktifitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const aktifitas = await prisma.aktifitas.findUnique({ where: { id } });

  if (!aktifitas) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 pt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/galeri">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </Button>
        </Link>

        <div className="bg-white rounded-2xl border p-8 md:p-12 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Activity className="h-4 w-4 mr-2" /> Tri Dharma
            </div>
            {aktifitas.tanggal && (
              <div className="flex items-center text-sm font-medium text-zinc-500">
                <Calendar className="h-4 w-4 mr-2" />
                {aktifitas.tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">{aktifitas.nama}</h1>
          <p className="text-lg text-zinc-600 leading-relaxed whitespace-pre-wrap">{aktifitas.deskripsi}</p>
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 mb-6 px-2">
          Lampiran & Dokumentasi ({aktifitas.gambarUrls.length})
        </h2>
        
        {aktifitas.gambarUrls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aktifitas.gambarUrls.map((url, index) => (
              <div key={index} className="aspect-[4/3] rounded-xl overflow-hidden border bg-zinc-100 shadow-sm hover:shadow-md transition-shadow group relative">
                
                {isImage(url) ? (
                  /* JIKA GAMBAR */
                  <img 
                    src={url} 
                    alt={`Dokumentasi ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center w-full h-full bg-zinc-50 hover:bg-blue-50 transition-colors p-6 text-center"
                  >
                      <FileText className="h-12 w-12 text-zinc-400 mb-3 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-semibold text-zinc-700 group-hover:text-blue-700 line-clamp-2 px-2">
                          Dokumen Lampiran {index + 1}
                      </span>
                      <span className="mt-3 text-xs font-medium text-blue-600 bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-blue-100">
                          <Download className="h-3 w-3" /> Unduh File
                      </span>
                  </a>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500 bg-white rounded-2xl border border-dashed">
            Belum ada dokumentasi atau lampiran untuk kegiatan ini.
          </div>
        )}
      </div>
    </div>
  );
}