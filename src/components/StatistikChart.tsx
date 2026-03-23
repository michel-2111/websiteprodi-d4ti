"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatistikChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="h-100 flex items-center justify-center text-zinc-500 bg-zinc-50 rounded-xl border border-dashed">Belum ada data statistik.</div>;
    }

    return (
        <div className="h-100 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="tahun" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="pendaftar" name="Pendaftar" fill="#a8c9ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="diterima" name="Diterima" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lulusan" name="Lulusan" fill="#194ea2" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}