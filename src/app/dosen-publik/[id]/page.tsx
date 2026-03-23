import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, HeartHandshake, Award, ExternalLink, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const prisma = new PrismaClient();

export const revalidate = 60;

export default async function DosenDetailPage({ 
    params 
    }: { 
    params: Promise<{ id: string }> 
    }) {
    const { id } = await params;

    const dosen = await prisma.user.findUnique({
        where: { id, role: "DOSEN" },
        include: {
        dosenProfile: {
            include: {
            publikasi: { orderBy: { tahun: 'desc' } },
            penelitian: { orderBy: { tahun: 'desc' } },
            pengabdian: { orderBy: { tahun: 'desc' } },
            sertifikat: { orderBy: { tahun: 'desc' } },
            }
        }
        }
    });

    if (!dosen || !dosen.dosenProfile) {
        notFound();
    }

    const profil = dosen.dosenProfile;

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
        <div className="bg-white border-b pt-8 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
            <Link href="/dosen-publik">
                <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Direktori
                </Button>
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-zinc-100 relative">
                {profil.fotoUrl ? (
                    <img src={profil.fotoUrl} alt={dosen.name || ""} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <Users className="h-16 w-16 opacity-50" />
                    </div>
                )}
                </div>

                <div className="flex-1 pt-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">{dosen.name}</h1>
                <p className="text-lg text-zinc-500 font-mono mb-6">NIDN. {profil.nidn}</p>
                
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Bidang Keahlian</h3>
                    <div className="flex flex-wrap gap-2">
                    {profil.kompetensi.map((komp, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {komp}
                        </span>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl mt-12">
            <Tabs defaultValue="publikasi" className="w-full">
            <TabsList className="w-full justify-start h-auto p-1 bg-white border rounded-xl overflow-x-auto flex-nowrap">
                <TabsTrigger value="publikasi" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <BookOpen className="h-4 w-4 mr-2" /> Publikasi ({profil.publikasi.length})
                </TabsTrigger>
                <TabsTrigger value="penelitian" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Search className="h-4 w-4 mr-2" /> Penelitian ({profil.penelitian.length})
                </TabsTrigger>
                <TabsTrigger value="pengabdian" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <HeartHandshake className="h-4 w-4 mr-2" /> Pengabdian ({profil.pengabdian.length})
                </TabsTrigger>
                <TabsTrigger value="sertifikat" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Award className="h-4 w-4 mr-2" /> Sertifikasi ({profil.sertifikat.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="publikasi" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-xl font-bold mb-6">Riwayat Publikasi</h2>
                <div className="space-y-6">
                {profil.publikasi.length === 0 ? (
                    <p className="text-zinc-500 italic">Belum ada data publikasi.</p>
                ) : (
                    profil.publikasi.map((item) => (
                    <div key={item.id} className="border-b last:border-0 pb-6 last:pb-0">
                        <div className="flex gap-4 items-start">
                        <div className="font-bold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-md">{item.tahun}</div>
                        <div>
                            <h4 className="font-semibold text-lg text-zinc-900">{item.judul}</h4>
                            <p className="text-blue-600 text-sm mt-1">{item.lokasi}</p>
                            {item.abstrak && <p className="text-zinc-600 text-sm mt-2">{item.abstrak}</p>}
                            {item.url && (
                            <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 mt-3 hover:underline">
                                <ExternalLink className="h-4 w-4 mr-1" /> Kunjungi Tautan
                            </a>
                            )}
                        </div>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </TabsContent>

            <TabsContent value="penelitian" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-xl font-bold mb-6">Riwayat Penelitian</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profil.penelitian.length === 0 ? (
                    <p className="text-zinc-500 italic">Belum ada data penelitian.</p>
                ) : (
                    profil.penelitian.map((item) => (
                    <div key={item.id} className="flex gap-4 border p-4 rounded-xl">
                        {item.gambarUrl && (
                        <div className="h-20 w-24 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                            <img src={item.gambarUrl} alt="Dokumentasi" className="w-full h-full object-cover" />
                        </div>
                        )}
                        <div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.tahun}</span>
                        <h4 className="font-semibold text-zinc-900 mt-2 line-clamp-3">{item.judul}</h4>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </TabsContent>

            <TabsContent value="pengabdian" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-xl font-bold mb-6">Pengabdian Kepada Masyarakat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profil.pengabdian.length === 0 ? (
                    <p className="text-zinc-500 italic">Belum ada data pengabdian.</p>
                ) : (
                    profil.pengabdian.map((item) => (
                    <div key={item.id} className="flex gap-4 border p-4 rounded-xl">
                        {item.gambarUrl && (
                        <div className="h-20 w-24 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                            <img src={item.gambarUrl} alt="Dokumentasi" className="w-full h-full object-cover" />
                        </div>
                        )}
                        <div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{item.tahun}</span>
                        <h4 className="font-semibold text-zinc-900 mt-2 line-clamp-3">{item.judul}</h4>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </TabsContent>

            <TabsContent value="sertifikat" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-xl font-bold mb-6">Sertifikasi Profesional</h2>
                <div className="space-y-4">
                {profil.sertifikat.length === 0 ? (
                    <p className="text-zinc-500 italic">Belum ada data sertifikasi.</p>
                ) : (
                    profil.sertifikat.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                        <h4 className="font-semibold text-zinc-900">{item.namaPelatihan}</h4>
                        <p className="text-sm text-zinc-500">Tahun {item.tahun}</p>
                        </div>
                        {item.dokumenUrl && (
                        <a href={item.dokumenUrl} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <FileText className="h-4 w-4 mr-2" /> Lihat Dokumen
                            </Button>
                        </a>
                        )}
                    </div>
                    ))
                )}
                </div>
            </TabsContent>

            </Tabs>
        </div>
        </div>
    );
}