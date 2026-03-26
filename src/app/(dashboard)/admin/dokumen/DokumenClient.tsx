"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createDokumen, updateDokumen, deleteDokumen } from "@/src/app/actions/dokumen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, X, AlertTriangle, Download, FileText } from "lucide-react";

export default function DokumenClient({ initialData }: { initialData: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    const handleAddNew = () => {
        setSelectedDoc(null);
        setIsModalOpen(true);
    };

    const handleEdit = (doc: any) => {
        setSelectedDoc(doc);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (doc: any) => {
        setSelectedDoc(doc);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (selectedDoc) {
                formData.append("id", selectedDoc.id);
                await updateDokumen(formData);
                toast.success("Dokumen berhasil diperbarui!");
            } else {
                await createDokumen(formData);
                toast.success("Dokumen baru berhasil diunggah!");
            }
            setIsModalOpen(false);
            window.location.reload(); 
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan saat menyimpan.");
        } finally {
            setIsLoading(false);
        }
    };

    const executeDelete = async () => {
        setIsLoading(true);
        try {
            await deleteDokumen(selectedDoc.id);
            toast.success("Dokumen berhasil dihapus!");
            setIsDeleteOpen(false);
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menghapus dokumen.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Pusat Dokumen</h2>
                        <p className="text-zinc-500">Kelola dokumen internal, template, dan pedoman untuk Dosen.</p>
                    </div>
                </div>
                
                <Button onClick={handleAddNew} className="bg-zinc-900 text-white hover:bg-zinc-800 shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Tambah Dokumen
                </Button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="w-1/3">Nama Dokumen</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead className="w-32">Tanggal</TableHead>
                            <TableHead className="text-right w-40">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-zinc-50/50">
                                <TableCell className="font-semibold text-zinc-900">{doc.nama}</TableCell>
                                <TableCell className="text-zinc-600 text-sm whitespace-pre-wrap">{doc.keterangan || "-"}</TableCell>
                                <TableCell className="text-zinc-500 text-sm">
                                    {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Unduh">
                                            <Download className="h-4 w-4" />
                                        </a>
                                        <button onClick={() => handleEdit(doc)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDeleteClick(doc)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {initialData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-zinc-500 py-12">
                                    Belum ada dokumen. Klik "Tambah Dokumen" untuk mengunggah.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-zinc-50/50">
                            <h3 className="font-bold text-lg text-zinc-900">{selectedDoc ? "Edit Dokumen" : "Unggah Dokumen Baru"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form action={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Dokumen</Label>
                                <Input id="nama" name="nama" defaultValue={selectedDoc?.nama} required placeholder="Contoh: Template Proposal Skripsi" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan Singkat (Opsional)</Label>
                                <Textarea id="keterangan" name="keterangan" defaultValue={selectedDoc?.keterangan} placeholder="Penjelasan mengenai isi dokumen..." className="h-20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file">File Dokumen {selectedDoc && <span className="text-xs text-blue-600 font-normal">(Kosongkan jika tidak ingin mengganti file)</span>}</Label>
                                <Input id="file" name="file" type="file" required={!selectedDoc} accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" />
                            </div>
                            <div className="pt-2 flex gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Batal</Button>
                                <Button type="submit" disabled={isLoading} className="bg-zinc-900 hover:bg-zinc-800 text-white">
                                    {isLoading ? "Menyimpan..." : "Simpan Dokumen"}
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
                            <h3 className="font-bold text-xl text-zinc-900 mb-2">Hapus Dokumen?</h3>
                            <p className="text-zinc-500 text-sm mb-6 leading-relaxed whitespace-normal break-words">
                                Yakin ingin menghapus <span className="font-bold text-zinc-900">{selectedDoc?.nama}</span>? Dokumen ini tidak akan bisa diakses lagi oleh Dosen.
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