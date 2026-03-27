import { PrismaClient } from "@prisma/client";
import VisiMisiClient from "./VisiMisiClient";

const prisma = new PrismaClient();

export const revalidate = 0;

export default async function AdminVisiMisiPage() {
    const visiMisiData = await prisma.visiMisi.findMany({
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <VisiMisiClient initialData={visiMisiData} />
        </div>
    );
}