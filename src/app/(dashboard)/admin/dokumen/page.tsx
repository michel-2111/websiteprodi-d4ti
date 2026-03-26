import { PrismaClient } from "@prisma/client";
import DokumenClient from "./DokumenClient";

const prisma = new PrismaClient();
export const revalidate = 0; 

export default async function AdminDokumenPage() {
    const dokumenList = await prisma.dokumen.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <DokumenClient initialData={dokumenList} />;
}