import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatistikChart from "@/src/components/StatistikChart";
import { ArrowRight, BookOpen, Users, Building2, GraduationCap, TrendingUp, UserCheck } from "lucide-react";
import ScrollAnimate from "@/src/components/ScrollAnimate";

const prisma = new PrismaClient();

export const revalidate = 60;

export default async function HomePage() {
    const rawStatistik = await prisma.statistikMahasiswa.findMany({
        orderBy: { tahun: 'desc' },
        take: 4,
    });

    const statistikData = rawStatistik.reverse();

    const latestYear = statistikData.length > 0 ? statistikData[statistikData.length - 1] : null;

    return (
        <div className="min-h-screen bg-white">
            <section className="relative overflow-hidden pt-28 pb-36">
                {/* Campus photo background */}
                <div className="absolute inset-0">
                    <img src="/kampus.jpg" alt="Kampus Politeknik Negeri Manado" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-950/70 to-indigo-950/80" />
                </div>

                <div className="absolute inset-0 dot-pattern opacity-30" />

                <div className="relative container mx-auto px-4 text-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-200 mb-8">
                            <GraduationCap className="h-4 w-4" />
                            Politeknik Negeri Manado
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 animate-fade-in-up delay-100" style={{ animationFillMode: 'both' }}>
                        Program Studi Sarjana Terapan <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">Teknik Informatika</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
                        Menghasilkan lulusan unggul, inovatif, dan siap kerja di bidang rekayasa perangkat lunak, jaringan, dan sistem cerdas.
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-20">
                        <path d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white" />
                    </svg>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <ScrollAnimate>
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                                <TrendingUp className="h-4 w-4" />
                                Data Terkini
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Statistik Mahasiswa</h2>
                            <p className="text-zinc-500">Perkembangan jumlah pendaftar, mahasiswa yang diterima, dan lulusan Program Studi D4 Teknik Informatika.</p>
                        </div>
                    </ScrollAnimate>

                    {latestYear && (
                        <ScrollAnimate delay={100}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 text-center border border-blue-100">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl" />
                                    <p className="text-3xl font-extrabold text-blue-600 mb-1">{latestYear.pendaftar}</p>
                                    <p className="text-sm font-medium text-blue-600/70">Pendaftar {latestYear.tahun}</p>
                                </div>
                                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 text-center border border-emerald-100">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 rounded-full blur-2xl" />
                                    <p className="text-3xl font-extrabold text-emerald-600 mb-1">{latestYear.diterima}</p>
                                    <p className="text-sm font-medium text-emerald-600/70">Diterima {latestYear.tahun}</p>
                                </div>
                                <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 text-center border border-purple-100">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl" />
                                    <p className="text-3xl font-extrabold text-purple-600 mb-1">{latestYear.lulusan}</p>
                                    <p className="text-sm font-medium text-purple-600/70">Lulusan {latestYear.tahun}</p>
                                </div>
                            </div>
                        </ScrollAnimate>
                    )}

                    <ScrollAnimate delay={200}>
                        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm">
                            <StatistikChart data={statistikData} />
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-zinc-50 to-white">
                <div className="container mx-auto px-4">
                    <ScrollAnimate>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Jelajahi Program Studi</h2>
                            <p className="text-zinc-500">Kenali lebih dekat komponen utama yang menjadikan D4 Teknik Informatika unggul dan terdepan.</p>
                        </div>
                    </ScrollAnimate>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <ScrollAnimate delay={0} className="h-full">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 text-center card-hover group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl" />
                                <div className="mx-auto h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-900">Tenaga Pendidik</h3>
                                <p className="text-zinc-500 mb-6 flex-1">Dosen profesional dengan sertifikasi dan pengalaman industri.</p>
                                <Link href="/dosen-publik" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link">
                                    Lihat Direktori Dosen <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </ScrollAnimate>

                        <ScrollAnimate delay={150} className="h-full">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 text-center card-hover group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl" />
                                <div className="mx-auto h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all">
                                    <BookOpen className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-900">Kurikulum Terkini</h3>
                                <p className="text-zinc-500 mb-6 flex-1">Berbasis project dan selaras dengan kebutuhan industri IT.</p>
                                <Link href="/kurikulum-publik" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group/link">
                                    Pelajari Kurikulum <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </ScrollAnimate>

                        <ScrollAnimate delay={300} className="h-full">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 text-center card-hover group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl" />
                                <div className="mx-auto h-14 w-14 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:shadow-xl group-hover:shadow-amber-500/30 transition-all">
                                    <Building2 className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-900">Fasilitas Lengkap</h3>
                                <p className="text-zinc-500 mb-6 flex-1">Laboratorium modern untuk menunjang praktik mahasiswa.</p>
                                <Link href="/galeri" className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors group/link">
                                    Lihat Fasilitas <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </ScrollAnimate>
                    </div>
                </div>
            </section>

            <div className="bg-gradient-to-b from-white to-zinc-100">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
                    <path d="M0 30L60 25C120 20 240 10 360 15C480 20 600 40 720 45C840 50 960 40 1080 30C1200 20 1320 10 1380 5L1440 0V60H0V30Z" fill="#09090b" />
                </svg>
            </div>
        </div>
    );
}