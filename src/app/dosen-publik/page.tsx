import { PrismaClient } from "@prisma/client";
import { Users, BookOpen, LinkIcon, Briefcase } from "lucide-react";
import Link from "next/link";
import ScrollAnimate from "@/src/components/ScrollAnimate";

const prisma = new PrismaClient();

export const revalidate = 60;

function formatJabatan(jabatan: string | null) {
    if (!jabatan) return "Belum Ada Jabatan";
    return jabatan
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default async function DosenPublikPage() {
    const dosenList = await prisma.user.findMany({
        where: {
            role: "DOSEN",
            dosenProfile: { isNot: null }
        },
        include: {
            dosenProfile: {
                include: {
                    _count: {
                        select: { 
                            publikasi: true, 
                            penelitianKetua: true, 
                            penelitianAnggota: true,
                            pengabdianKetua: true,
                            pengabdianAnggota: true,
                            bukuAjarKetua: true,
                            bukuAjarAnggota: true,
                            hkiKetua: true,
                            hkiAnggota: true,
                        }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl" />
                <div className="relative container mx-auto px-4 py-20 text-center max-w-3xl">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                        <Users className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Direktori Pengajar</h1>
                    <p className="text-lg text-blue-200/70">
                        Mengenal lebih dekat para pakar, praktisi, dan akademisi di balik Program Studi D4 Teknik Informatika.
                    </p>
                </div>
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                    <path d="M0 30L48 26C96 22 192 14 288 18C384 22 480 38 576 42C672 46 768 38 864 30C960 22 1056 14 1152 18C1248 22 1344 38 1392 46L1440 54V60H0V30Z" fill="#fafafa" />
                </svg>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dosenList.map((dosen, index) => {
                        const profil = dosen.dosenProfile!;
                            const totalKarya = profil._count.publikasi + 
                                            profil._count.penelitianKetua + profil._count.penelitianAnggota + 
                                            profil._count.pengabdianKetua + profil._count.pengabdianAnggota +
                                            profil._count.bukuAjarKetua + profil._count.bukuAjarAnggota +
                                            profil._count.hkiKetua + profil._count.hkiAnggota;

                        return (
                            <ScrollAnimate key={dosen.id} delay={index < 8 ? index * 80 : 0}>
                                <Link href={`/dosen-publik/${dosen.id}`} className="block">
                                    <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 group card-hover cursor-pointer h-full flex flex-col">
                                        {/* Foto Area */}
                                        <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                                            {profil.fotoUrl ? (
                                                <img
                                                    src={profil.fotoUrl}
                                                    alt={dosen.name || "Foto Dosen"}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 text-zinc-400">
                                                    <Users className="h-12 w-12 mb-2 opacity-40" />
                                                    <span className="text-sm font-medium">Belum ada foto</span>
                                                </div>
                                            )}
                                            
                                            {/* Badge Jabatan Fungsional (Baru ditambahkan di atas foto) */}
                                            {profil.jabatanFungsional && (
                                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-zinc-800 shadow flex items-center">
                                                    <Briefcase className="h-3 w-3 mr-1.5 text-blue-600" />
                                                    {formatJabatan(profil.jabatanFungsional)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg text-zinc-900 line-clamp-1" title={dosen.name || ""}>
                                                {dosen.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500 mb-4 font-mono">NIDN. {profil.nidn}</p>

                                            <div className="flex flex-wrap gap-2 mb-6 flex-1">
                                                {profil.kompetensi.slice(0, 3).map((komp, idx) => (
                                                    <span key={idx} className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {komp}
                                                    </span>
                                                ))}
                                                {profil.kompetensi.length > 3 && (
                                                    <span className="inline-flex items-center rounded-lg bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
                                                        +{profil.kompetensi.length - 3} lainnya
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-sm mt-auto">
                                                <div className="flex items-center text-zinc-600">
                                                    <BookOpen className="h-4 w-4 mr-1 text-orange-500" />
                                                    <span>{totalKarya} Karya</span>
                                                </div>
                                                <span className="text-blue-600 group-hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors">
                                                    Lihat Profil
                                                    <LinkIcon className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </ScrollAnimate>
                        );
                    })}
                </div>

                {dosenList.length === 0 && (
                    <div className="text-center py-24 text-zinc-500 bg-white rounded-2xl border border-dashed">
                        Belum ada data dosen yang dipublikasikan.
                    </div>
                )}
            </div>
        </div>
    );
}