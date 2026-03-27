import { PrismaClient } from "@prisma/client";
import { Target } from "lucide-react";
import ScrollAnimate from "@/src/components/ScrollAnimate";

const prisma = new PrismaClient();
export const revalidate = 60;

// Mapping Enum ke Judul dan ID untuk Anchor Scroll
const sectionConfig = [
    { type: "VISI_POLIMDO", title: "Visi Polimdo", id: "visi-polimdo" },
    { type: "MISI_POLIMDO", title: "Misi Polimdo", id: "misi-polimdo" },
    { type: "TUJUAN_POLIMDO", title: "Tujuan Polimdo", id: "tujuan-polimdo" },
    { type: "VISI_PRODI", title: "Visi Program Studi DIV Informatika", id: "visi-prodi" },
    { type: "MISI_PRODI", title: "Misi Program Studi DIV Informatika", id: "misi-prodi" },
    { type: "TUJUAN_PRODI", title: "Tujuan Program Studi DIV Informatika", id: "tujuan-prodi" },
    { type: "VISI_KEILMUAN", title: "Visi Keilmuan Program Studi", id: "visi-keilmuan" },
];

export default async function VisiMisiPublikPage() {
    const data = await prisma.visiMisi.findMany();

    const dataMap: Record<string, string> = {};
    data.forEach(item => {
        dataMap[item.tipe] = item.konten;
    });

    return (
        <div className="min-h-screen bg-zinc-50 pb-24">
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-30" />
                <div className="relative container mx-auto px-4 py-20 text-center max-w-3xl">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                        <Target className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Visi, Misi & Tujuan</h1>
                    <p className="text-lg text-blue-200/70">
                        Arah langkah dan pedoman fundamental Politeknik Negeri Manado serta Program Studi Sarjana Terapan Teknik Informatika.
                    </p>
                </div>
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                    <path d="M0 30L48 26C96 22 192 14 288 18C384 22 480 38 576 42C672 46 768 38 864 30C960 22 1056 14 1152 18C1248 22 1344 38 1392 46L1440 54V60H0V30Z" fill="#fafafa" />
                </svg>
            </div>

            {/* Konten Utama */}
            <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-16">
                {sectionConfig.map((section, index) => {
                    const konten = dataMap[section.type];
                    if (!konten) return null; // Sembunyikan jika Admin belum mengisi

                    return (
                        <ScrollAnimate key={section.id} delay={100}>
                            {/* Scroll target padding offset */}
                            <div id={section.id} className="scroll-mt-28">
                                <div className="bg-white rounded-3xl p-8 md:p-10 border border-zinc-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 rounded-l-3xl opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6 pl-4">{section.title}</h2>
                                    <div className="pl-4 prose prose-blue max-w-none text-zinc-600 whitespace-pre-wrap text-justify leading-relaxed">
                                        {konten}
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimate>
                    );
                })}

                {Object.keys(dataMap).length === 0 && (
                    <div className="text-center py-20 text-zinc-500 bg-white rounded-2xl border border-dashed">
                        Data Visi dan Misi sedang dalam pembaruan.
                    </div>
                )}
            </div>
        </div>
    );
}