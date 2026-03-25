"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteUser, updateUser } from "@/src/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, X, AlertTriangle } from "lucide-react"

export default function UserActionButtons({ user }: { user: any }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(user.id);
            toast.success("Pengguna berhasil dihapus!");
            setIsDeleteOpen(false);
        } catch (e) {
            toast.error("Gagal menghapus pengguna.");
            setIsDeleting(false);
        }
    };

    const handleEdit = async (formData: FormData) => {
        formData.append("id", user.id);
        const promise = updateUser(formData).then(() => setIsEditOpen(false));
        
        toast.promise(promise, {
            loading: "Menyimpan perubahan...",
            success: "Data pengguna berhasil diperbarui!",
            error: "Gagal menyimpan. Pastikan email tidak duplikat."
        });
    };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 px-2">
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(true)} disabled={isDeleting} className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-zinc-50/50">
                            <h3 className="font-bold text-lg text-zinc-900">Edit Pengguna</h3>
                            <button onClick={() => setIsEditOpen(false)} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form action={handleEdit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input id="name" name="name" defaultValue={user.name} required />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Login</Label>
                                <Input id="email" name="email" type="email" defaultValue={user.email} required />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="role">Hak Akses (Role)</Label>
                                <select 
                                    id="role" 
                                    name="role" 
                                    defaultValue={user.role} 
                                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="DOSEN">DOSEN</option>
                                    <option value="GKM">GKM</option>
                                </select>
                            </div>
                            
                            <div className="pt-2 flex gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                                <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white">Simpan Perubahan</Button>
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
                            
                            <h3 className="font-bold text-xl text-zinc-900 mb-2">Hapus Pengguna?</h3>
                            
                            <p className="text-zinc-500 text-sm mb-6 leading-relaxed whitespace-normal break-words">
                                Yakin ingin menghapus <span className="font-bold text-zinc-900">{user.name}</span>? 
                                Jika pengguna ini adalah Dosen, seluruh data profil dan karyanya akan ikut terhapus permanen.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsDeleteOpen(false)} 
                                    disabled={isDeleting} 
                                    className="w-full"
                                >
                                    Batal
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={executeDelete} 
                                    disabled={isDeleting} 
                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}