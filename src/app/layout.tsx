import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisitorTracker from "../components/VisitorTracker";

export const metadata = {
    title: "Sistem Informasi Prodi D4 TI",
    description: "Politeknik Negeri Manado",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-zinc-50 text-zinc-900 flex flex-col min-h-screen">
                <VisitorTracker />
                <Navbar />

                <main className="flex-1">
                    {children}
                </main>
                <Footer />
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}