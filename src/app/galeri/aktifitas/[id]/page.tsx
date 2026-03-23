import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Activity, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();
export const revalidate = 60;

export default async function AktifitasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const aktifitas = await prisma.aktifitas.findUnique({ where: { id } });

  if (!aktifitas) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 pt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/galeri">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Galeri
          </Button>
        </Link>

        <div className="bg-white rounded-2xl border p-8 md:p-12 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Activity className="h-4 w-4 mr-2" /> Kegiatan Prodi
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

        <h2 className="text-2xl font-bold text-zinc-900 mb-6 px-2">Dokumentasi Kegiatan ({aktifitas.gambarUrls.length})</h2>
        
        {aktifitas.gambarUrls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aktifitas.gambarUrls.map((url, index) => (
              <div key={index} className="aspect-[4/3] rounded-xl overflow-hidden border bg-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                <img src={url} alt={`Dokumentasi ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500 bg-white rounded-2xl border border-dashed">
            Belum ada dokumentasi foto untuk kegiatan ini.
          </div>
        )}
      </div>
    </div>
  );
}