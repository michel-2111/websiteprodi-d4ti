import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HeartHandshake, Calendar, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();
export const revalidate = 60;

export default async function PengabdianDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const data = await prisma.pengabdian.findUnique({
        where: { id },
        include: {
            ketua: { include: { user: true } },
            anggota: { include: { user: true } }
        }
    });

    if (!data) notFound();

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            {/* Header / Navigasi */}
            <div className="bg-white border-b pt-8 pb-6">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link href={`/dosen-publik/${data.ketua.userId}`}>
                        <Button variant="ghost" size="sm" className="mb-4 -ml-3 text-zinc-500 hover:text-green-600">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Profil {data.ketua.user.name}
                        </Button>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            <HeartHandshake className="h-3.5 w-3.5" /> Pengabdian
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-600 border px-3 py-1 rounded-full text-xs font-bold">
                            <Calendar className="h-3.5 w-3.5" /> Tahun {data.tahun}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                        {data.judul}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl mt-8">
                {data.gambarUrls && data.gambarUrls.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Foto Dokumentasi ({data.gambarUrls.length})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {data.gambarUrls.map((url, index) => (
                                <div key={index} className="aspect-[4/3] bg-white rounded-xl overflow-hidden border shadow-sm group cursor-pointer">
                                    <img 
                                        src={url} 
                                        alt={`${data.judul} - ${index + 1}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Deskripsi */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-4 text-zinc-900 border-b pb-4">Deskripsi Kegiatan</h3>
                            {data.deskripsi ? (
                                <p className="text-zinc-600 leading-relaxed whitespace-pre-line text-justify">
                                    {data.deskripsi}
                                </p>
                            ) : (
                                <p className="text-zinc-400 italic">Deskripsi detail tidak dilampirkan untuk kegiatan ini.</p>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Tim Pengabdian */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-6">
                            <h3 className="font-bold text-zinc-900 border-b pb-3 mb-4">Tim Pengabdian</h3>
                            
                            <div className="space-y-4">
                                {/* Ketua */}
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Ketua Pelaksana</p>
                                    <Link href={`/dosen-publik/${data.ketua.userId}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-zinc-50 transition-colors group">
                                        <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-zinc-900 text-sm group-hover:text-green-600 transition-colors">{data.ketua.user.name}</p>
                                        </div>
                                    </Link>
                                </div>

                                {/* Anggota */}
                                {data.anggota.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Anggota Tim</p>
                                        <div className="space-y-1">
                                            {data.anggota.map(anggota => (
                                                <Link key={anggota.id} href={`/dosen-publik/${anggota.userId}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-zinc-50 transition-colors group">
                                                    <div className="h-8 w-8 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center shrink-0">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                    <p className="font-medium text-zinc-700 text-sm group-hover:text-green-600 transition-colors">{anggota.user.name}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}