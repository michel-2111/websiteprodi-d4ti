"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Building2, Activity, Calendar, Images, FileText, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import ScrollAnimate from "@/src/components/ScrollAnimate";
import { Button } from "@/components/ui/button";

function isImage(url: string) {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext));
}

export default function GaleriClient({ fasilitasList, aktifitasList }: { fasilitasList: any[], aktifitasList: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            <div className="relative bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl" />
                <div className="relative container mx-auto px-4 py-20 text-center max-w-3xl">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                        <Images className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Galeri & Fasilitas</h1>
                    <p className="text-lg text-blue-200/70">
                        Jelajahi berbagai fasilitas laboratorium modern dan dokumentasi kegiatan akademik maupun non-akademik di lingkungan prodi.
                    </p>
                </div>
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                    <path d="M0 30L48 26C96 22 192 14 288 18C384 22 480 38 576 42C672 46 768 38 864 30C960 22 1056 14 1152 18C1248 22 1344 38 1392 46L1440 54V60H0V30Z" fill="#fafafa" />
                </svg>
            </div>

            <div className="container mx-auto px-4 mt-12 max-w-6xl">
                <Tabs defaultValue="fasilitas" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 p-1 bg-white border border-zinc-200 rounded-xl shadow-sm">
                        <TabsTrigger value="fasilitas" className="rounded-lg data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                            <Building2 className="h-4 w-4 mr-2" /> Fasilitas
                        </TabsTrigger>
                        <TabsTrigger value="aktifitas" className="rounded-lg data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                            <Activity className="h-4 w-4 mr-2" /> Tri Dharma
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fasilitas" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {fasilitasList.map((item, index) => (
                                <ScrollAnimate key={item.id} delay={index < 6 ? index * 100 : 0}>
                                    <Link href={`/galeri/fasilitas/${item.id}`} className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col card-hover h-full">
                                        
                                        <div className="aspect-4/3 bg-zinc-100 relative overflow-hidden flex items-center justify-center">
                                            {item.gambarUrls && item.gambarUrls.length > 0 ? (
                                                <>
                                                    {item.gambarUrls[0]?.match(/\.(mp4|webm|ogg|mov|mkv)(?:\?.*)?$/i) ? (
                                                        <div className="w-full h-full relative">
                                                            <video 
                                                                src={item.gambarUrls[0]} 
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                preload="metadata"
                                                                playsInline
                                                                onClick={(e) => {
                                                                    e.preventDefault(); 
                                                                }}
                                                            />
                                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                                        </div>
                                                    ) : (
                                                        <img 
                                                            src={item.gambarUrls[0]} 
                                                            alt={item.nama} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                        />
                                                    )}
                                                    {item.gambarUrls.length > 1 && (
                                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md z-10 pointer-events-none">
                                                            <Images className="h-3 w-3 mr-1.5" /> 
                                                            +{item.gambarUrls.length - 1} Media
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 text-zinc-400">
                                                    <Building2 className="h-10 w-10 mb-2 opacity-30" />
                                                    <span className="text-sm font-medium">Tanpa Media</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-xl text-zinc-900 mb-3 line-clamp-2">{item.nama}</h3>
                                            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 flex-1">{item.deskripsi}</p>
                                            <span className="text-blue-600 text-sm font-semibold mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Lihat Detail <span className="transition-transform">&rarr;</span>
                                            </span>
                                        </div>
                                    </Link>
                                </ScrollAnimate>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="aktifitas" className="mt-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 sm:p-6 rounded-2xl border shadow-sm">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900">Arsip Tri Dharma</h3>
                                <p className="text-sm text-zinc-500">Jelajahi dokumentasi dan lampiran kegiatan.</p>
                            </div>
                            <div className="relative w-full sm:w-87.5 shrink-0">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari kegiatan atau deskripsi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:border-blue-500 focus:bg-white w-full transition-all text-base"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {aktifitasList
                                .filter((item) => {
                                    const query = searchQuery.toLowerCase();
                                    return (
                                        item.nama.toLowerCase().includes(query) ||
                                        item.deskripsi.toLowerCase().includes(query)
                                    );
                                })
                                .map((item, index) => {
                                    const coverImage = item.gambarUrls?.find((url: string) => isImage(url));
                                    const totalFiles = item.gambarUrls?.length || 0;
                                    const extraFilesCount = totalFiles > 1 ? totalFiles - 1 : 0;

                                    return (
                                        <ScrollAnimate key={item.id} delay={index < 6 ? index * 100 : 0}>
                                            <Link href={`/galeri/aktifitas/${item.id}`} className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col card-hover h-full">
                                                <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                                                    {coverImage ? (
                                                        <>
                                                            <img src={coverImage} alt={item.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            {extraFilesCount > 0 && (
                                                                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md">
                                                                    <Activity className="h-3 w-3 mr-1.5" /> +{extraFilesCount} Lampiran
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 text-zinc-400">
                                                            {totalFiles > 0 ? (
                                                                <>
                                                                    <FileText className="h-10 w-10 mb-2 opacity-40 text-blue-500" />
                                                                    <span className="text-sm font-medium text-zinc-600">{totalFiles} Dokumen Terlampir</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Activity className="h-10 w-10 mb-2 opacity-30" />
                                                                    <span className="text-sm font-medium">Tanpa Lampiran</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg mb-4 self-start">
                                                        <Calendar className="h-3 w-3 mr-1.5" />
                                                        {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal tidak ditentukan'}
                                                    </div>
                                                    <h3 className="font-bold text-lg text-zinc-900 mb-3 line-clamp-2">{item.nama}</h3>
                                                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 flex-1 text-justify break-all">{item.deskripsi}</p>
                                                    <span className="text-blue-600 text-sm font-semibold mt-4 inline-flex items-center group-hover:gap-2 transition-all">Lihat Detail & Lampiran <span className="group-hover:translate-x-1 transition-transform">&rarr;</span></span>
                                                </div>
                                            </Link>
                                        </ScrollAnimate>
                                    );
                                })}
                        </div>

                        {aktifitasList.filter(item =>
                            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200 mt-8">
                                <div className="h-16 w-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 mb-1">Hasil Tidak Ditemukan</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto mb-4">
                                    Kami tidak dapat menemukan data Tri Dharma yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                                </p>
                                <Button variant="outline" onClick={() => setSearchQuery("")} className="rounded-full">
                                    Bersihkan Pencarian
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}