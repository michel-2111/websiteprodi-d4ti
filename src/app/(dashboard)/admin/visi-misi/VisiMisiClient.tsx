"use client";

import { useState } from "react";
import { toast } from "sonner";
import { upsertVisiMisi, deleteVisiMisi } from "@/src/app/actions/visimisi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, Plus, Edit, Trash2, X, AlertTriangle } from "lucide-react";

const labelMap: Record<string, string> = {
    "VISI_POLIMDO": "Visi Polimdo",
    "MISI_POLIMDO": "Misi Polimdo",
    "TUJUAN_POLIMDO": "Tujuan Polimdo",
    "VISI_PRODI": "Visi Program Studi",
    "MISI_PRODI": "Misi Program Studi",
    "TUJUAN_PRODI": "Tujuan Program Studi",
    "VISI_KEILMUAN": "Visi Keilmuan",
};

export default function VisiMisiClient({ initialData }: { initialData: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleAddNew = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (item: any) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            await upsertVisiMisi(formData);
            toast.success("Konten berhasil disimpan!");
            setIsModalOpen(false);
            window.location.reload(); 
        } catch (error: any) {
            toast.error(error.message || "Gagal menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    const executeDelete = async () => {
        setIsLoading(true);
        try {
            await deleteVisiMisi(selectedItem.id);
            toast.success("Konten berhasil dihapus!");
            setIsDeleteOpen(false);
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menghapus data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Visi Misi & Tujuan</h2>
                        <p className="text-zinc-500">Kelola konten arah institusi untuk ditampilkan ke publik.</p>
                    </div>
                </div>
                <Button onClick={handleAddNew} className="bg-zinc-900 text-white hover:bg-zinc-800 shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Tambah / Edit Konten
                </Button>
            </div>

            {/* Tabel Data */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="w-1/4 font-semibold text-zinc-900">Kategori</TableHead>
                            <TableHead className="font-semibold text-zinc-900">Isi Konten</TableHead>
                            <TableHead className="text-right w-32 font-semibold text-zinc-900">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-zinc-50/50">
                                <TableCell className="font-medium text-blue-700">
                                    {labelMap[item.tipe] || item.tipe}
                                </TableCell>
                                <TableCell className="text-zinc-600 text-sm">
                                    <div className="line-clamp-2 whitespace-pre-wrap">{item.konten}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDeleteClick(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {initialData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-zinc-500 py-12">
                                    Belum ada data Visi Misi yang ditambahkan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-zinc-50/50">
                            <h3 className="font-bold text-lg text-zinc-900">
                                {selectedItem ? "Edit Konten" : "Tambah Konten Baru"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form action={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="tipe">Pilih Kategori</Label>
                                <select 
                                    id="tipe" 
                                    name="tipe" 
                                    required 
                                    defaultValue={selectedItem?.tipe || ""} 
                                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="" disabled>-- Pilih Jenis --</option>
                                    {Object.entries(labelMap).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="konten">Isi Konten</Label>
                                <Textarea 
                                    id="konten" 
                                    name="konten" 
                                    required 
                                    defaultValue={selectedItem?.konten} 
                                    placeholder="Masukkan teks di sini. Gunakan tombol 'Enter' untuk membuat poin-poin atau paragraf baru..." 
                                    className="h-48 whitespace-pre-wrap leading-relaxed" 
                                />
                                <p className="text-xs text-zinc-500">
                                    Garis baru (Enter) akan otomatis dirender dengan rapi di halaman publik.
                                </p>
                            </div>
                            
                            <div className="pt-2 flex gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Batal</Button>
                                <Button type="submit" disabled={isLoading} className="bg-zinc-900 hover:bg-zinc-800 text-white">
                                    {isLoading ? "Menyimpan..." : "Simpan Konten"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl text-zinc-900 mb-2">Hapus Konten?</h3>
                            <p className="text-zinc-500 text-sm mb-6 leading-relaxed whitespace-normal break-words">
                                Yakin ingin menghapus <span className="font-bold text-zinc-900">{labelMap[selectedItem?.tipe]}</span>? Konten ini akan hilang dari Halaman Publik.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isLoading} className="w-full">
                                    Batal
                                </Button>
                                <Button type="button" onClick={executeDelete} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
                                    {isLoading ? "Menghapus..." : "Ya, Hapus"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}