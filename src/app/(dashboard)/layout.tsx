import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/src/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = session.user.role;

  return (
    <div className="flex min-h-screen bg-zinc-100/50">
      <Sidebar role={userRole} />

      <main className="flex-1 pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl px-6 shadow-sm">
          <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Sistem Informasi Prodi</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-500">
              Login sebagai:
            </div>
            <div className="inline-flex items-center gap-2 bg-zinc-100 rounded-full px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <strong className="text-sm text-zinc-900 font-semibold">{session.user.name}</strong>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}