import { PrismaClient } from "@prisma/client";
import PortalProgramStudi from "../components/portal-program-studi";

const prisma = new PrismaClient();

export default async function PortalUtamaPage() {
    const prodis = await prisma.prodi.findMany({
        orderBy: { nama: "asc" },
        select: { id: true, nama: true, slug: true },
    });

    return <PortalProgramStudi prodis={prodis} />;
}