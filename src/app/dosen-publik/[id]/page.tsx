import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
    ArrowLeft, BookOpen, Search, HeartHandshake, Award, 
    ExternalLink, FileText, Users, Mail, Phone, Briefcase, 
    Shield, Library, Lightbulb 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const prisma = new PrismaClient();
export const revalidate = 60;

// Fungsi pembantu untuk merapikan teks Enum
function formatEnum(text: string | null | undefined) {
    if (!text) return null;
    return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Fungsi untuk menggabungkan data Ketua & Anggota, lalu mengurutkan berdasarkan tahun
function gabungDanUrutkanKarya(karyaKetua: any[], karyaAnggota: any[]) {
    const sebagaiKetua = karyaKetua.map(item => ({ ...item, peran: "Ketua" }));
    const sebagaiAnggota = karyaAnggota.map(item => ({ ...item, peran: "Anggota" }));
    
    return [...sebagaiKetua, ...sebagaiAnggota].sort((a, b) => {
        const tahunA = a.tahun || 0;
        const tahunB = b.tahun || 0;
        return tahunB - tahunA;
    });
}

export default async function DosenDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const userInclude = { select: { name: true } };
    const relasiKarya = {
        ketua: { include: { user: userInclude } },
        anggota: { include: { user: userInclude } }
    };

    const dosen = await prisma.user.findUnique({
        where: { id, role: "DOSEN" },
        include: {
            dosenProfile: {
                include: {
                    publikasi: { orderBy: { tahun: 'desc' } },
                    sertifikat: { orderBy: { tahun: 'desc' } },
                    penelitianKetua: { include: relasiKarya },
                    penelitianAnggota: { include: relasiKarya },
                    pengabdianKetua: { include: relasiKarya },
                    pengabdianAnggota: { include: relasiKarya },
                    bukuAjarKetua: { include: relasiKarya },
                    bukuAjarAnggota: { include: relasiKarya },
                    hkiKetua: { include: relasiKarya },
                    hkiAnggota: { include: relasiKarya },
                }
            }
        }
    });

    if (!dosen || !dosen.dosenProfile) notFound();
    const profil = dosen.dosenProfile;

    const daftarPenelitian = gabungDanUrutkanKarya(profil.penelitianKetua, profil.penelitianAnggota);
    const daftarPengabdian = gabungDanUrutkanKarya(profil.pengabdianKetua, profil.pengabdianAnggota);
    const daftarBukuAjar = gabungDanUrutkanKarya(profil.bukuAjarKetua, profil.bukuAjarAnggota);
    const daftarHki = gabungDanUrutkanKarya(profil.hkiKetua, profil.hkiAnggota);

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
                        {/* Area Foto */}
                        <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-zinc-100 relative">
                            {profil.fotoUrl ? (
                                <img src={profil.fotoUrl} alt={dosen.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                    <Users className="h-16 w-16 opacity-50" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pt-2 w-full">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">{dosen.name}</h1>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                                <span className="text-zinc-600 font-mono flex items-center bg-zinc-100 px-2.5 py-1 rounded-md text-sm border">
                                    NIDN. {profil.nidn || "-"}
                                </span>
                                {profil.jabatanFungsional && (
                                    <span className="text-blue-700 font-medium flex items-center bg-blue-50 px-2.5 py-1 rounded-md text-sm border border-blue-100">
                                        <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                        {formatEnum(profil.jabatanFungsional)}
                                    </span>
                                )}
                                {profil.pangkat && (
                                    <span className="text-emerald-700 font-medium flex items-center bg-emerald-50 px-2.5 py-1 rounded-md text-sm border border-emerald-100">
                                        <Shield className="h-3.5 w-3.5 mr-1.5" />
                                        {formatEnum(profil.pangkat)}
                                    </span>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <div className="flex items-center text-sm text-zinc-600">
                                    <Mail className="h-4 w-4 mr-3 text-zinc-400" />
                                    {profil.email || <span className="italic text-zinc-400">Email belum ditambahkan</span>}
                                </div>
                                <div className="flex items-center text-sm text-zinc-600">
                                    <Phone className="h-4 w-4 mr-3 text-zinc-400" />
                                    {profil.telepon || <span className="italic text-zinc-400">Nomor kontak belum ditambahkan</span>}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Bidang Keahlian</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profil.kompetensi.map((komp, idx) => (
                                        <span key={idx} className="inline-flex items-center rounded-md bg-zinc-900 text-white px-3 py-1 text-xs font-medium shadow-sm">
                                            {komp}
                                        </span>
                                    ))}
                                    {profil.kompetensi.length === 0 && <span className="text-sm text-zinc-500 italic">Belum ada data keahlian.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl mt-12">
                <Tabs defaultValue="publikasi" className="w-full">
                    <TabsList className="w-full justify-start h-auto p-1 bg-white border rounded-xl overflow-x-auto flex-nowrap hide-scrollbar">
                        <TabsTrigger value="publikasi" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                            <BookOpen className="h-4 w-4 mr-2" /> Publikasi ({profil.publikasi.length})
                        </TabsTrigger>
                        <TabsTrigger value="penelitian" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                            <Search className="h-4 w-4 mr-2" /> Penelitian ({daftarPenelitian.length})
                        </TabsTrigger>
                        <TabsTrigger value="pengabdian" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                            <HeartHandshake className="h-4 w-4 mr-2" /> Pengabdian ({daftarPengabdian.length})
                        </TabsTrigger>
                        <TabsTrigger value="buku" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                            <Library className="h-4 w-4 mr-2" /> Buku Ajar ({daftarBukuAjar.length})
                        </TabsTrigger>
                        <TabsTrigger value="hki" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                            <Lightbulb className="h-4 w-4 mr-2" /> HKI ({daftarHki.length})
                        </TabsTrigger>
                        <TabsTrigger value="sertifikat" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                            <Award className="h-4 w-4 mr-2" /> Sertifikasi ({profil.sertifikat.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="publikasi" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Riwayat Publikasi Jurnal & Konferensi</h2>
                        <div className="space-y-6">
                            {profil.publikasi.length === 0 ? (
                                <p className="text-zinc-500 italic">Belum ada data publikasi.</p>
                            ) : (
                                profil.publikasi.map((item) => (
                                    <div key={item.id} className="border-b last:border-0 pb-6 last:pb-0">
                                        <div className="flex gap-4 items-start">
                                            <div className="font-bold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-md shrink-0">{item.tahun}</div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-zinc-900">{item.judul}</h4>
                                                <p className="text-blue-600 text-sm mt-1">{item.lokasi}</p>
                                                {item.abstrak && <p className="text-zinc-600 text-sm mt-2 leading-relaxed">{item.abstrak}</p>}
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
                        <div className="space-y-6">
                            {daftarPenelitian.length === 0 ? (
                                <p className="text-zinc-500 italic">Belum ada data penelitian.</p>
                            ) : (
                                daftarPenelitian.map((item) => (
                                    <div key={item.id} className="flex gap-5 border p-5 rounded-xl bg-zinc-50/50">
                                        {item.gambarUrls && item.gambarUrls.length > 0 && (
                                            <div className="hidden sm:block h-24 w-32 shrink-0 rounded-lg overflow-hidden bg-white border shadow-sm">
                                                <img src={item.gambarUrls[0]} alt="Dokumentasi" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-zinc-700 bg-white border px-2 py-0.5 rounded shadow-sm">{item.tahun}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.peran === 'Ketua' ? 'bg-amber-100 text-amber-700' : 'bg-zinc-200 text-zinc-700'}`}>
                                                    {item.peran}
                                                </span>
                                            </div>
                                            <Link href={`/penelitian/${item.id}`} className="hover:underline">
                                                <h4 className="font-semibold text-lg text-zinc-900 mb-2">{item.judul}</h4>
                                            </Link>
                                            <div className="text-sm text-zinc-600 space-y-1 mt-3 p-3 bg-white rounded-lg border">
                                                <p><span className="font-semibold text-zinc-800">Ketua:</span> {item.ketua?.user?.name || "Tidak diketahui"}</p>
                                                <p><span className="font-semibold text-zinc-800">Anggota:</span> {item.anggota?.length > 0 ? item.anggota.map((a: any) => a.user?.name).join(', ') : '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="pengabdian" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Pengabdian Kepada Masyarakat</h2>
                        <div className="space-y-6">
                            {daftarPengabdian.length === 0 ? (
                                <p className="text-zinc-500 italic">Belum ada data pengabdian.</p>
                            ) : (
                                daftarPengabdian.map((item) => (
                                    <div key={item.id} className="flex gap-5 border p-5 rounded-xl bg-zinc-50/50">
                                        {item.gambarUrls && item.gambarUrls.length > 0 && (
                                            <div className="hidden sm:block h-24 w-32 shrink-0 rounded-lg overflow-hidden bg-white border shadow-sm">
                                                <img src={item.gambarUrls[0]} alt="Dokumentasi" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-zinc-700 bg-white border px-2 py-0.5 rounded shadow-sm">{item.tahun}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.peran === 'Ketua' ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-700'}`}>
                                                    {item.peran}
                                                </span>
                                            </div>
                                            <Link href={`/pengabdian/${item.id}`} className="hover:underline">
                                                <h4 className="font-semibold text-lg text-zinc-900 mb-2">{item.judul}</h4>
                                            </Link>
                                            <div className="text-sm text-zinc-600 space-y-1 mt-3 p-3 bg-white rounded-lg border">
                                                <p><span className="font-semibold text-zinc-800">Ketua:</span> {item.ketua?.user?.name || "Tidak diketahui"}</p>
                                                <p><span className="font-semibold text-zinc-800">Anggota:</span> {item.anggota?.length > 0 ? item.anggota.map((a: any) => a.user?.name).join(', ') : '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="buku" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Karya Buku Ajar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {daftarBukuAjar.length === 0 ? (
                                <p className="text-zinc-500 italic md:col-span-2">Belum ada data buku ajar.</p>
                            ) : (
                                daftarBukuAjar.map((item) => (
                                    <div key={item.id} className="border p-5 rounded-xl flex flex-col h-full hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded">{item.tahun}</span>
                                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                                                Penulis {item.peran}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-lg text-zinc-900 mb-2 line-clamp-2">{item.judul}</h4>
                                        {item.deskripsi && <p className="text-sm text-zinc-600 mb-4 line-clamp-3 flex-1">{item.deskripsi}</p>}
                                        
                                        <div className="mt-auto pt-4 border-t text-sm">
                                            <p className="text-zinc-800 font-medium truncate">Oleh: {item.ketua?.user?.name}</p>
                                            {item.anggota?.length > 0 && (
                                                <p className="text-zinc-500 truncate text-xs mt-1">Bersama: {item.anggota.map((a: any) => a.user?.name).join(', ')}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="hki" className="mt-6 bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Hak Kekayaan Intelektual (HKI)</h2>
                        <div className="space-y-4">
                            {daftarHki.length === 0 ? (
                                <p className="text-zinc-500 italic">Belum ada data HKI.</p>
                            ) : (
                                daftarHki.map((item) => (
                                    <div key={item.id} className="border p-5 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md border border-rose-100">
                                                    {item.kategori}
                                                </span>
                                                {item.tahun && <span className="text-xs font-semibold text-zinc-500">{item.tahun}</span>}
                                            </div>
                                            <h4 className="font-bold text-lg text-zinc-900 mb-1">{item.judul}</h4>
                                            <p className="text-sm text-zinc-600">
                                                Inventor {item.peran} &bull; <span className="font-medium text-zinc-800">{item.ketua?.user?.name}</span>
                                                {item.anggota?.length > 0 && ` dkk.`}
                                            </p>
                                        </div>
                                        {item.link && (
                                            <a href={item.link} target="_blank" rel="noreferrer" className="shrink-0">
                                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                    <ExternalLink className="h-4 w-4 mr-2" /> Cek Status
                                                </Button>
                                            </a>
                                        )}
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