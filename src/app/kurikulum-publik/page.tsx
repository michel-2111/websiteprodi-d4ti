import { PrismaClient } from "@prisma/client";
import { BookOpen, Download, Info, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ScrollAnimate from "@/src/components/ScrollAnimate";

const prisma = new PrismaClient();

export const revalidate = 60;

export default async function KurikulumPublikPage() {
    const kurikulumAktif = await prisma.kurikulum.findFirst({
        where: { aktif: true },
        include: {
            mataKuliah: {
                orderBy: [
                    { semester: 'asc' },
                    { nama: 'asc' }
                ]
            }
        }
    });

    if (!kurikulumAktif) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center py-24 px-4 text-center">
                <BookOpen className="h-16 w-16 text-zinc-300 mb-4" />
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Kurikulum Belum Tersedia</h2>
                <p className="text-zinc-500 max-w-md">
                    Saat ini belum ada kurikulum yang diaktifkan oleh Administrator Program Studi. Silakan kembali lagi nanti.
                </p>
            </div>
        );
    }

    const mkPerSemester = kurikulumAktif.mataKuliah.reduce((acc, mk) => {
        if (!acc[mk.semester]) {
            acc[mk.semester] = [];
        }
        acc[mk.semester].push(mk);
        return acc;
    }, {} as Record<number, typeof kurikulumAktif.mataKuliah>);

    const daftarSemester = Object.keys(mkPerSemester).map(Number).sort((a, b) => a - b);

    const totalSKS = kurikulumAktif.mataKuliah.reduce((total, mk) => total + mk.sks, 0);

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl" />
                <div className="relative container mx-auto px-4 py-20 max-w-5xl">
                <div>
                    <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-sm font-medium text-blue-200 mb-4">
                        <BookOpen className="h-4 w-4 mr-2" /> Kurikulum Aktif
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                            {kurikulumAktif.nama}
                        </h1>

                        {kurikulumAktif.dokumenUrl && (
                            <a href={kurikulumAktif.dokumenUrl} target="_blank" rel="noreferrer" className="shrink-0 w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-6 text-sm md:text-base flex bg-white text-slate-900 hover:bg-blue-50 shadow-xl shadow-black/20 transition-all font-semibold">
                                    <Download className="h-5 w-5 mr-2" />
                                    Unduh Dokumen SK / PDF
                                </Button>
                            </a>
                        )}
                    </div>

                    <p className="text-lg text-blue-200/70 mb-6 leading-relaxed text-justify">
                        {kurikulumAktif.deskripsi || "Struktur kurikulum yang dirancang untuk menghasilkan lulusan yang kompeten, profesional, dan siap menghadapi tantangan industri teknologi informasi."}
                    </p>

                    <div className="inline-flex flex-wrap items-center gap-6 text-sm font-medium text-blue-200 bg-white/5 backdrop-blur-sm border border-white/10 py-3 px-5 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-blue-400" />
                            <span>Total <strong className="text-white text-lg">{totalSKS}</strong> SKS</span>
                        </div>
                        <div className="w-px h-6 bg-white/20 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-400" />
                            <span>Berlaku sejak <strong className="text-white">{kurikulumAktif.tahunMulai}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                    <path d="M0 30L48 26C96 22 192 14 288 18C384 22 480 38 576 42C672 46 768 38 864 30C960 22 1056 14 1152 18C1248 22 1344 38 1392 46L1440 54V60H0V30Z" fill="#fafafa" />
                </svg>
            </div>

            <div className="container mx-auto px-4 max-w-5xl mt-12 space-y-12">
                <ScrollAnimate>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-zinc-900">Sebaran Mata Kuliah</h2>
                        <p className="text-zinc-500 mt-2">Daftar mata kuliah yang ditempuh dari semester awal hingga akhir.</p>
                    </div>
                </ScrollAnimate>

                {daftarSemester.map((semester, index) => {
                    const mataKuliah = mkPerSemester[semester];
                    const totalSksSemester = mataKuliah.reduce((sum, mk) => sum + mk.sks, 0);

                    return (
                        <ScrollAnimate key={semester} delay={index < 4 ? index * 100 : 0}>
                            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-4 flex items-center justify-between text-white">
                                    <h3 className="text-lg font-bold">Semester {semester}</h3>
                                    <span className="text-sm font-medium bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                                        {totalSksSemester} SKS
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-zinc-50/80">
                                            <TableRow>
                                                <TableHead className="w-30 font-semibold text-zinc-900">Kode MK</TableHead>
                                                <TableHead className="font-semibold text-zinc-900">Nama Mata Kuliah</TableHead>
                                                <TableHead className="w-25 text-center font-semibold text-zinc-900">SKS</TableHead>
                                                <TableHead className="w-37.5 font-semibold text-zinc-900">Jenis</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mataKuliah.map((mk) => (
                                                <TableRow key={mk.id} className="hover:bg-blue-50/30 transition-colors">
                                                    <TableCell className="font-mono text-xs font-medium text-zinc-500">
                                                        {mk.kodeMk}
                                                    </TableCell>
                                                    <TableCell className="w-full max-w-75 md:max-w-112.5">
                                                        <div className="font-semibold text-zinc-900">{mk.nama}</div>
                                                        
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <div className="mt-1 cursor-pointer group">
                                                                    <p className="text-sm text-zinc-500 line-clamp-1 truncate group-hover:text-blue-600 transition-colors">
                                                                        {mk.deskripsi}
                                                                    </p>
                                                                    
                                                                    <p className="text-[10px] font-bold text-blue-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                                                        Lihat Deskripsi Lengkap &rarr;
                                                                    </p>
                                                                </div>
                                                            </DialogTrigger>
                                                            
                                                            <DialogContent className="sm:max-w-137.5 bg-white rounded-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-2xl font-bold text-zinc-900">
                                                                        {mk.nama}
                                                                    </DialogTitle>
                                                                    <div className="flex items-center gap-2 pt-2 pb-4 border-b border-zinc-100">
                                                                        <span className="text-xs font-semibold bg-zinc-100 border px-2 py-1 rounded-md text-zinc-600">
                                                                            Kode: {mk.kodeMk}
                                                                        </span>
                                                                        <span className="text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700 px-2 py-1 rounded-md">
                                                                            {mk.sks} SKS
                                                                        </span>
                                                                    </div>
                                                                </DialogHeader>
                                                                
                                                                <div className="mt-2 text-zinc-600 leading-relaxed text-justify whitespace-pre-line">
                                                                    {mk.deskripsi}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-blue-600">
                                                        {mk.sks}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${mk.jenis === 'Wajib' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                                mk.jenis === 'Pilihan' ? 'bg-orange-50 text-orange-700 ring-orange-600/10' :
                                                                    mk.jenis === 'Praktikum' ? 'bg-green-50 text-green-700 ring-green-600/10' :
                                                                        'bg-zinc-50 text-zinc-600 ring-zinc-500/10'
                                                            }`}>
                                                            {mk.jenis}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </ScrollAnimate>
                    );
                })}
            </div>
        </div>
    );
}