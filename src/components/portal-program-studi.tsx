"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    Cpu,
    Code2,
    GraduationCap,
    Zap,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Users,
} from "lucide-react";

// Bentuk data minimal yang dibutuhkan komponen ini.
// Cocok dengan hasil `prisma.prodi.findMany({ select: { id, nama, slug } })`.
// `gambar` opsional — kalau field ini belum ada di database, komponen akan
// otomatis memakai placeholder berdasarkan slug (lihat getBackgroundUrl).
type Prodi = {
    id: string | number;
    nama: string;
    slug: string;
    gambar?: string | null;
};

type Disiplin = "informatika" | "listrik" | "komputer" | "lainnya";

// Setiap disiplin keilmuan di Jurusan Teknik Elektro punya warna aksen &
// ikon sendiri, jadi warna di kartu benar-benar merepresentasikan bidang
// keilmuan prodi tsb — bukan sekadar dekorasi.
const DISIPLIN_CONFIG: Record<
    Disiplin,
    { icon: typeof Zap; tagline: string; accent: string; accentSoft: string; gradient: string }
    > = {
    informatika: {
        icon: Code2,
        tagline: "Rekayasa perangkat lunak, basis data, dan sistem informasi.",
        accent: "#2563EB",
        accentSoft: "#EFF4FF",
        gradient: "linear-gradient(135deg,#1D4ED8,#0B1330)",
    },
    listrik: {
        icon: Zap,
        tagline: "Instalasi, konversi energi, dan pengendalian sistem tenaga listrik.",
        accent: "#D97706",
        accentSoft: "#FFF7EB",
        gradient: "linear-gradient(135deg,#B45309,#0B1330)",
    },
    komputer: {
        icon: Cpu,
        tagline: "Jaringan komputer, sistem tertanam, dan infrastruktur perangkat keras.",
        accent: "#0D9488",
        accentSoft: "#ECFAF8",
        gradient: "linear-gradient(135deg,#0F766E,#0B1330)",
    },
    lainnya: {
        icon: GraduationCap,
        tagline: "Program pendidikan vokasi Jurusan Teknik Elektro.",
        accent: "#4338CA",
        accentSoft: "#F0EFFE",
        gradient: "linear-gradient(135deg,#3730A3,#0B1330)",
    },
};

function getDisiplin(nama: string): Disiplin {
    const n = nama.toLowerCase();
    if (n.includes("informatika")) return "informatika";
    if (n.includes("listrik")) return "listrik";
    if (n.includes("komputer")) return "komputer";
    return "lainnya";
}

function getJenjang(nama: string, slug: string): "D4" | "D3" | "" {
    const t = `${nama} ${slug}`.toLowerCase();
    if (t.includes("d4") || t.includes("d-4") || t.includes("d.iv") || t.includes("sarjana terapan")) {
        return "D4";
    }
    if (t.includes("d3") || t.includes("d-3") || t.includes("d.iii") || t.includes("diploma")) {
        return "D3";
    }
    return "";
}

// Placeholder background per prodi. Kalau field `gambar` sudah diisi dari
// database, itu yang dipakai. Kalau belum, coba `/images/prodi/{slug}.jpg`
// (tinggal taruh file dengan nama itu di /public/images/prodi/). Kalau file
// itu juga tidak ada, gradient warna disiplin (di DISIPLIN_CONFIG) akan
// tampil sendiri sebagai fallback karena background-image gagal dimuat.
function getBackgroundUrl(prodi: Prodi): string {
    return prodi.gambar || `/images/${prodi.slug}.jpg`;
}

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function PortalProgramStudi({ prodis }: { prodis: Prodi[] }) {
    const counts = useMemo(() => {
        const d4 = prodis.filter((p) => getJenjang(p.nama, p.slug) === "D4").length;
        const d3 = prodis.filter((p) => getJenjang(p.nama, p.slug) === "D3").length;
        return { total: prodis.length, d4, d3 };
    }, [prodis]);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-body)" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
                :root {
                    --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
                    --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }
                @keyframes pg-fade-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pg-in { opacity: 0; animation: pg-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

                @media (prefers-reduced-motion: reduce) {
                    .pg-in { animation: none !important; opacity: 1 !important; transform: none !important; }
                }
            `}</style>

            <section className="relative isolate overflow-hidden bg-[#0B1330] pb-20 pt-20 sm:pb-28 sm:pt-24">
                {/* Foto gedung + gradient overlay navy — ganti bg-image sesuai aset Anda */}
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center"
                    style={{ backgroundImage: "url('/kampus.jpg')" }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 -z-10 bg-linear-to-b from-[#0B1330]/95 via-[#111F52]/90 to-[#1E3A8A]/85"
                    aria-hidden="true"
                />

                <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
                    <span
                        className="pg-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur"
                        style={{ animationDelay: "0.05s" }}
                    >
                        <GraduationCap className="h-4 w-4 text-[#38BDF8]" />
                        Politeknik Negeri Manado
                    </span>

                    <h1
                        className="pg-in text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
                        style={{ fontFamily: "var(--font-display)", animationDelay: "0.15s" }}
                    >
                        Jurusan
                        <br />
                        <span className="text-[#38BDF8]">Teknik Elektro</span>
                    </h1>

                    <p
                        className="pg-in mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
                        style={{ animationDelay: "0.25s" }}
                    >
                        Empat program studi dalam satu jurusan. Geser untuk menjelajahi
                        setiap program studi dan akses portal akademiknya.
                    </p>

                    <div
                        className="pg-in mt-9 flex flex-wrap items-center justify-center gap-3"
                        style={{ animationDelay: "0.35s" }}
                    >
                        <StatPill label="Program Studi" value={counts.total} />
                        <StatPill label="Sarjana Terapan (D4)" value={counts.d4} />
                        <StatPill label="Diploma (D3)" value={counts.d3} />
                    </div>
                </div>

                {/* Wave divider */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-0" aria-hidden="true">
                    <svg viewBox="0 0 1440 120" className="h-20 w-full sm:h-28" preserveAspectRatio="none">
                        <path
                            fill="#ffffff"
                            d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z"
                        />
                    </svg>
                </div>
            </section>

            {/* === SLIDER PROGRAM STUDI === */}
            <section className="relative overflow-hidden py-12 sm:py-16">
                {/* Pola titik tipis di latar putih supaya section tidak terasa kosong */}
                <div
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
                    style={{
                        backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 85%)",
                        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 85%)",
                    }}
                    aria-hidden="true"
                />

                <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-8 lg:px-16">
                    <div className="pg-in mb-8 flex flex-col items-center text-center" style={{ animationDelay: "0.1s" }}>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1330] text-white">
                            <Users className="h-6 w-6" />
                        </div>
                        <h2
                            className="text-2xl font-semibold text-[#0B1330] sm:text-3xl"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Direktori Program Studi
                        </h2>
                        <p className="mt-3 max-w-md text-sm text-slate-500 sm:text-base">
                            Geser ke kiri atau kanan untuk melihat setiap program studi.
                        </p>
                    </div>

                    {prodis.length > 0 ? (
                        <ProdiSlider prodis={prodis} />
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                            <GraduationCap className="mb-4 h-8 w-8 text-slate-400" />
                            <p className="text-sm text-slate-500">
                                Belum ada program studi yang terdaftar di sistem.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function StatPill({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/90 backdrop-blur">
            <span className="text-lg font-semibold text-white">{value}</span>
            <span className="text-xs uppercase tracking-wide text-white/60">{label}</span>
        </div>
    );
}

// === Slider: satu prodi per slide, dengan slide aktif selalu di TENGAH
// viewport sehingga peek slide sebelumnya (kiri) & berikutnya (kanan)
// sama-sama terlihat. Bisa digeser (swipe/drag), panah, & titik navigasi ===
function ProdiSlider({ prodis }: { prodis: Prodi[] }) {
    const [index, setIndex] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<{ startX: number; dragging: boolean }>({ startX: 0, dragging: false });

    const GAP = 20; // px

    const clamp = useCallback((i: number) => Math.max(0, Math.min(prodis.length - 1, i)), [prodis.length]);
    const goTo = useCallback((i: number) => setIndex(clamp(i)), [clamp]);
    const prev = useCallback(() => goTo(index - 1), [goTo, index]);
    const next = useCallback(() => goTo(index + 1), [goTo, index]);

    const onPointerDown = (e: React.PointerEvent) => {
        dragState.current = { startX: e.clientX, dragging: true };
        (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onPointerUp = (e: React.PointerEvent) => {
        if (!dragState.current.dragging) return;
        const delta = e.clientX - dragState.current.startX;
        dragState.current.dragging = false;
        const THRESHOLD = 50;
        if (delta > THRESHOLD) prev();
        else if (delta < -THRESHOLD) next();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    };

    return (
        <div className="relative">
            <div
                className="group relative"
                role="region"
                aria-roledescription="carousel"
                aria-label="Daftar program studi"
                tabIndex={0}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                <div className="overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex touch-pan-y transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [--sw:88%] lg:[--sw:78%]"
                        style={{
                            // Offset konstan (100% - lebar slide) / 2 menempatkan slide
                            // aktif di tengah viewport, lalu digeser per index seperti biasa —
                            // hasilnya peek muncul simetris di kiri & kanan.
                            transform: `translateX(calc((100% - var(--sw)) / 2 - ${index} * (var(--sw) + ${GAP}px)))`,
                            gap: `${GAP}px`,
                        }}
                    >
                        {prodis.map((prodi) => {
                            const disiplin = getDisiplin(prodi.nama);
                            const cfg = DISIPLIN_CONFIG[disiplin];
                            const Icon = cfg.icon;
                            const jenjang = getJenjang(prodi.nama, prodi.slug);

                            return (
                                <div
                                    key={prodi.id}
                                    className="w-[var(--sw)] flex-none select-none"
                                >
                                    <div
                                        className="relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-3xl bg-cover bg-center p-8 sm:min-h-[500px] sm:p-10"
                                        style={{
                                            backgroundImage: `url('${getBackgroundUrl(prodi)}')`,
                                            backgroundColor: cfg.accent,
                                        }}
                                    >
                                        {/* Fallback gradient warna disiplin — selalu tampil di bawah foto,
                                            jadi kalau placeholder foto belum diganti, slide tetap terlihat rapi */}
                                        <div className="absolute inset-0 -z-10" style={{ background: cfg.gradient }} aria-hidden="true" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" aria-hidden="true" />

                                        <div className="relative flex items-start justify-between">
                                            <div
                                                className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur"
                                                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            {jenjang && (
                                                <span className="rounded-md border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white backdrop-blur">
                                                    {jenjang}
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative mt-auto">
                                            <h3 className="text-2xl font-semibold leading-snug text-white sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                                                {prodi.nama}
                                            </h3>
                                            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                                                {cfg.tagline}
                                            </p>

                                            <Link
                                                href={`/${prodi.slug}`}
                                                className={`mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0B1330] transition hover:bg-white/90 ${FOCUS_RING}`}
                                            >
                                                Buka Portal
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Panah navigasi */}
                {index > 0 && (
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Program studi sebelumnya"
                        className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#0B1330] shadow-md transition hover:bg-white sm:left-4 ${FOCUS_RING}`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                )}
                {index < prodis.length - 1 && (
                    <button
                        type="button"
                        onClick={next}
                        aria-label="Program studi berikutnya"
                        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#0B1330] shadow-md transition hover:bg-white sm:right-4 ${FOCUS_RING}`}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Titik navigasi */}
            <div className="mt-6 flex items-center justify-center gap-2">
                {prodis.map((prodi, i) => (
                    <button
                        key={prodi.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Ke slide ${prodi.nama}`}
                        aria-current={i === index}
                        className={`h-2 rounded-full transition-all ${FOCUS_RING} ${
                            i === index ? "w-8 bg-[#0B1330]" : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                    />
                ))}
            </div>

            {/* Strip navigasi cepat — daftar semua prodi dalam baris ringkas,
                mengisi lebar penuh section dan mempercepat lompat ke prodi tertentu */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {prodis.map((prodi, i) => {
                    const disiplin = getDisiplin(prodi.nama);
                    const cfg = DISIPLIN_CONFIG[disiplin];
                    const Icon = cfg.icon;
                    const active = i === index;
                    return (
                        <button
                            key={prodi.id}
                            type="button"
                            onClick={() => goTo(i)}
                            className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${FOCUS_RING} ${
                                active
                                    ? "border-transparent shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                            style={active ? { backgroundColor: cfg.accentSoft } : undefined}
                        >
                            <span
                                className="flex h-9 w-9 flex-none items-center justify-center rounded-lg"
                                style={{ backgroundColor: cfg.accentSoft, color: cfg.accent }}
                            >
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="truncate text-sm font-medium text-[#0B1330]">{prodi.nama}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}