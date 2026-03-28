import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatistikChart from "@/src/components/StatistikChart";
import { ArrowRight, BookOpen, Users, Building2, GraduationCap, TrendingUp, CalendarDays, Activity, Download, Eye, ExternalLink, Newspaper } from "lucide-react";
import ScrollAnimate from "@/src/components/ScrollAnimate";
import { Calendar } from "@/components/ui/calendar";
import TechNewsCarousel from "@/src/components/TechNewsCarousel";

const prisma = new PrismaClient();
export const revalidate = 60;
function isImage(url: string) {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

export default async function HomePage() {
    const rawStatistik = await prisma.statistikMahasiswa.findMany({
        orderBy: { tahun: 'desc' },
        take: 4,
    });
    const statistikData = rawStatistik.reverse();
    const latestYear = statistikData.length > 0 ? statistikData[statistikData.length - 1] : null;

    const jadwalTerbaru = await prisma.aktifitas.findFirst({
        where: {
            OR: [
                { nama: { contains: "jadwal" } },
                { deskripsi: { contains: "Jadwal Perkuliahan mahasiswa semester" } }
            ]
        },
        orderBy: { tanggal: 'desc' }
    });

    const dataPengunjung = await prisma.pengunjung.findUnique({ where: { id: "global" } });
    const totalPengunjung = dataPengunjung?.total || 0;

    let techNews = [];
    try {
        const res = await fetch('https://dev.to/api/articles?tag=programming&per_page=8', { 
            next: { revalidate: 3600 } 
        });
        if (res.ok) {
            techNews = await res.json();
        }
    } catch (error) {
        console.error("Gagal memuat berita teknologi:", error);
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="relative overflow-hidden pt-28 pb-36">
                <div className="absolute inset-0">
                    <img src="/kampus.jpg" alt="Kampus Politeknik Negeri Manado" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 via-blue-950/70 to-indigo-950/80" />
                </div>
                <div className="absolute inset-0 dot-pattern opacity-30" />

                <div className="relative container mx-auto px-4 text-center">
                    <div className="animate-fade-in-up">
                        <a 
                            href="https://polimdo.ac.id" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-200 mb-8"
                        >
                            <GraduationCap className="h-4 w-4" /> Politeknik Negeri Manado
                        </a>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 animate-fade-in-up delay-100" style={{ animationFillMode: 'both' }}>
                        Program Studi Sarjana Terapan <br className="hidden md:block" />
                        <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">Teknik Informatika</span>
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
                <div className="container mx-auto px-4 max-w-7xl">
                    <ScrollAnimate>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                                <TrendingUp className="h-4 w-4" /> Data Terkini
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Dashboard & Statistik</h2>
                            <p className="text-zinc-500">Informasi akademik, perkembangan mahasiswa, dan jadwal perkuliahan Program Studi D4 Teknik Informatika.</p>
                        </div>
                    </ScrollAnimate>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        <div className="lg:col-span-2 space-y-8">
                            {latestYear && (
                                <ScrollAnimate delay={100}>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="relative overflow-hidden bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 text-center border border-blue-100 shadow-sm transition-all hover:shadow-md">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl" />
                                            <p className="text-3xl font-extrabold text-blue-600 mb-1">{latestYear.pendaftar}</p>
                                            <p className="text-sm font-medium text-blue-600/70">Pendaftar {latestYear.tahun}</p>
                                        </div>
                                        <div className="relative overflow-hidden bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 text-center border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 rounded-full blur-2xl" />
                                            <p className="text-3xl font-extrabold text-emerald-600 mb-1">{latestYear.diterima}</p>
                                            <p className="text-sm font-medium text-emerald-600/70">Diterima {latestYear.tahun}</p>
                                        </div>
                                        <div className="relative overflow-hidden bg-linear-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 text-center border border-purple-100 shadow-sm transition-all hover:shadow-md">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl" />
                                            <p className="text-3xl font-extrabold text-purple-600 mb-1">{latestYear.lulusan}</p>
                                            <p className="text-sm font-medium text-purple-600/70">Lulusan {latestYear.tahun}</p>
                                        </div>
                                    </div>
                                </ScrollAnimate>
                            )}

                            <ScrollAnimate delay={200}>
                                <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-bold text-zinc-800 mb-6 px-2">Grafik Mahasiswa</h3>
                                    <StatistikChart data={statistikData} />
                                </div>
                            </ScrollAnimate>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Widget Jadwal */}
                            <ScrollAnimate delay={150}>
                                <div className="bg-linear-to-br from-indigo-50 to-blue-50/50 rounded-3xl border border-indigo-100 p-6 shadow-sm relative overflow-hidden group">
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-200/40 rounded-full blur-2xl group-hover:bg-indigo-300/50 transition-colors duration-500" />
                                    
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-indigo-950">Jadwal Perkuliahan</h3>
                                            <p className="text-xs text-indigo-600/70 font-medium">Semester Berjalan</p>
                                        </div>
                                    </div>

                                    {jadwalTerbaru ? (
                                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white shadow-sm">
                                            <h4 className="font-semibold text-zinc-900 text-sm mb-1 line-clamp-2">{jadwalTerbaru.nama}</h4>
                                            <p className="text-xs text-zinc-500 mb-3">
                                                Diunggah: {jadwalTerbaru.tanggal ? jadwalTerbaru.tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                            </p>
                                            
                                            {jadwalTerbaru.gambarUrls && jadwalTerbaru.gambarUrls.length > 0 ? (
                                                <a href={jadwalTerbaru.gambarUrls[0]} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md shadow-indigo-600/20">
                                                    {isImage(jadwalTerbaru.gambarUrls[0]) ? <Eye className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                                                    {isImage(jadwalTerbaru.gambarUrls[0]) ? "Lihat Jadwal" : "Unduh Dokumen"}
                                                </a>
                                            ) : (
                                                <Link href={`/galeri/aktifitas/${jadwalTerbaru.id}`} className="w-full inline-flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                                    Lihat Detail
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-white/50 rounded-xl border border-dashed border-indigo-200">
                                            <p className="text-sm text-indigo-600/60 font-medium">Jadwal belum tersedia.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollAnimate>

                            <ScrollAnimate delay={250}>
                                <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center">
                                    <h3 className="w-full font-bold text-zinc-800 mb-2 px-2 flex items-center gap-2">Kalender Hari Ini</h3>
                                    <Calendar mode="single" selected={new Date()} className="pointer-events-none p-0" />
                                </div>
                            </ScrollAnimate>

                            <ScrollAnimate delay={350}>
                                <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-xl shadow-zinc-900/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                        <Activity className="h-20 w-20" />
                                    </div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <div className="text-zinc-400 text-sm font-medium mb-1">Total Kunjungan Web</div>
                                            <div className="text-3xl font-extrabold tracking-tight">
                                                {totalPengunjung.toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                                            <Users className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimate>

                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-linear-to-b from-zinc-50 to-white">
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
                                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-t-2xl" />
                                <div className="mx-auto h-14 w-14 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all">
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
                                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-t-2xl" />
                                <div className="mx-auto h-14 w-14 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all">
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
                                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-orange-500 rounded-t-2xl" />
                                <div className="mx-auto h-14 w-14 bg-linear-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:shadow-xl group-hover:shadow-amber-500/30 transition-all">
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

            <section className="py-24 bg-white overflow-hidden relative border-t border-zinc-100">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 translate-x-1/2" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <ScrollAnimate>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 max-w-7xl mx-auto px-4 sm:px-12">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                                    <Newspaper className="h-4 w-4" /> Info Teknologi
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Update Dunia IT</h2>
                                <p className="text-zinc-500">Tetap terhubung dengan perkembangan terbaru seputar pemrograman, inovasi teknologi, dan industri rekayasa perangkat lunak global.</p>
                            </div>
                            <div className="mt-6 md:mt-0 hidden sm:block">
                                <Link href="https://dev.to/t/programming" target="_blank" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                                    Sumber: Dev.to <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </ScrollAnimate>

                    <ScrollAnimate delay={200}>
                        <TechNewsCarousel articles={techNews} />
                    </ScrollAnimate>
                </div>
            </section>

            <div className="bg-linear-to-b from-white to-zinc-100">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
                    <path d="M0 30L60 25C120 20 240 10 360 15C480 20 600 40 720 45C840 50 960 40 1080 30C1200 20 1320 10 1380 5L1440 0V60H0V30Z" fill="#09090b" />
                </svg>
            </div>
        </div>
    );
}