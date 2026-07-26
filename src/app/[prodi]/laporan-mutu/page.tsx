import { PrismaClient } from "@prisma/client";
import { ShieldCheck, FileText, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimate from "@/src/components/ScrollAnimate";

const prisma = new PrismaClient();

export const revalidate = 60;

export default async function LaporanMutuPublikPage() {
    const laporanList = await prisma.laporanGkm.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="relative container mx-auto px-4 py-20 text-center max-w-3xl">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Penjaminan Mutu</h1>
                    <p className="text-lg text-blue-200/70">
                        Transparansi dan akuntabilitas Program Studi melalui dokumen evaluasi, audit internal, dan laporan kinerja oleh Gugus Kendali Mutu (GKM).
                    </p>
                </div>
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                    <path d="M0 30L48 26C96 22 192 14 288 18C384 22 480 38 576 42C672 46 768 38 864 30C960 22 1056 14 1152 18C1248 22 1344 38 1392 46L1440 54V60H0V30Z" fill="#fafafa" />
                </svg>
            </div>

            <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-8">
                {laporanList.map((item, index) => (
                    <ScrollAnimate key={item.id} delay={index < 4 ? index * 100 : 0}>
                        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 md:p-8 card-hover">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                                <div className="flex-1">
                                    <div className="inline-flex items-center text-xs font-semibold text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full mb-4 font-mono">
                                        <Calendar className="h-3 w-3 mr-2" />
                                        Semester {item.semester}
                                    </div>
                                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">{item.judul}</h2>

                                    <a href={item.dokumenUrl} target="_blank" rel="noreferrer">
                                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg transition-all">
                                            <FileText className="h-4 w-4 mr-2" /> Lihat Dokumen Laporan (PDF)
                                        </Button>
                                    </a>
                                </div>

                                {item.dokumentasiUrls && item.dokumentasiUrls.length > 0 && (
                                    <div className="w-full md:w-72 shrink-0">
                                        <h3 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center">
                                            <ImageIcon className="h-4 w-4 mr-2 text-zinc-500" />
                                            Bukti Dokumentasi ({item.dokumentasiUrls.length})
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.dokumentasiUrls.slice(0, 4).map((url, idx) => (
                                                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border bg-zinc-100 relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Dokumentasi ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    {idx === 3 && item.dokumentasiUrls.length > 4 && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold rounded-xl">
                                                            +{item.dokumentasiUrls.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </ScrollAnimate>
                ))}

                {laporanList.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-zinc-500">
                        <ShieldCheck className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                        <p className="text-lg font-medium">Belum ada dokumen mutu yang dipublikasikan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}