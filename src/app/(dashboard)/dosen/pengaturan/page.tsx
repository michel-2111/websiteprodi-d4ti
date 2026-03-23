import FormGantiPassword from "@/src/components/FormGantiPassword";
import { Settings } from "lucide-react";

export default function PengaturanDosenPage() {
    return (
        <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg">
            <Settings className="h-6 w-6" />
            </div>
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h2>
            <p className="text-zinc-500">Kelola keamanan kredensial login Anda.</p>
            </div>
        </div>

        <div className="mt-8">
            <FormGantiPassword />
        </div>
        </div>
    );
}