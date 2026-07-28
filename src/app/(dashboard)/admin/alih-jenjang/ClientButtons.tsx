"use client";

import { useTransition, useState } from "react";
import { Download, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAlihJenjang } from "@/src/app/actions/alih-jenjang"; // Sesuaikan path jika berbeda
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// KOMPONEN 1: Tombol Export CSV (Tetap sama)
export function ExportCsvButton({ data }: { data: any[] }) {
    const handleExport = () => {
        const headers = ["Nama Lengkap", "Nomor Telepon", "Alamat Domisili", "URL Ijazah", "URL KTP", "URL CV", "URL Pasfoto", "Tanggal Pendaftaran"];
        const csvRows = [headers.join(",")];

        data.forEach(item => {
            const row = [
                `"${item.nama}"`,
                `"${item.telepon}"`,
                `"${item.alamat.replace(/\n/g, " ")}"`,
                `"${item.ijazahUrl}"`,
                `"${item.ktpUrl}"`,
                `"${item.cvUrl}"`,
                `"${item.pasfotoUrl}"`,
                `"${new Date(item.createdAt).toLocaleDateString("id-ID")}"`
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `Rekap_Alih_Jenjang_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
    );
}

// KOMPONEN 2: Tombol & Popup Konfirmasi Hapus Modern
export function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol kemunculan popup dialog

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteAlihJenjang(id);
            if (response.success) {
                setIsOpen(false); // Tutup dialog jika sukses
            } else {
                alert(response.error);
            }
        });
    };

    return (
        <>
            {/* Tombol pemicu awal */}
            <button 
                onClick={() => setIsOpen(true)} 
                title="Hapus Peserta"
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {/* Popup Kustom Dialog Konfirmasi */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-xl border border-zinc-200 p-6">
                    <DialogHeader className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-zinc-950">Konfirmasi Hapus</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 max-w-xs">
                            Apakah Anda yakin ingin menghapus data peserta ini secara permanen? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="flex sm:flex-row justify-center gap-3 pt-4 border-t border-zinc-100 mt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsOpen(false)}
                            className="w-full sm:w-auto border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleDelete}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Ya, Hapus"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}