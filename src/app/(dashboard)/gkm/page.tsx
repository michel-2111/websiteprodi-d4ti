import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { ShieldCheck, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function GkmDashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-6 max-w-4xl">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex items-start gap-6">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Selamat Datang, {session?.user?.name}!</h2>
            <p className="text-zinc-600 leading-relaxed mb-6">
                Anda login sebagai Gugus Kendali Mutu (GKM). Di portal ini, Anda bertanggung jawab untuk mengelola arsip laporan penjaminan mutu, evaluasi kinerja, dan dokumen akreditasi.
            </p>
            <Link href="/gkm/laporan">
                <Button>
                <FileCheck className="h-4 w-4 mr-2" /> Kelola Laporan Mutu
                </Button>
            </Link>
            </div>
        </div>
        </div>
    );
}