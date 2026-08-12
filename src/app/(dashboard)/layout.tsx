import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardClientWrapper from "./DashboardClientWrapper"; // Import wrapper klien

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Proses Pengecekan Autentikasi di Server
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // 2. Kirim data sesi dan konten ke komponen Wrapper Klien
  return (
    <DashboardClientWrapper 
      userRole={session.user.role} 
      userName={session.user.name || "User"}
    >
      {children}
    </DashboardClientWrapper>
  );
}