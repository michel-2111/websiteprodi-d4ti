import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const prodis = [
        { nama: 'D4 Teknik Informatika', slug: 'd4-ti' },
        { nama: 'D4 Teknik Listrik', slug: 'd4-teknik-listrik' },
        { nama: 'D3 Teknik Listrik', slug: 'd3-teknik-listrik' },
        { nama: 'D3 Teknik Komputer', slug: 'd3-teknik-komputer' },
    ];

    for (const prodi of prodis) {
        await prisma.prodi.upsert({
        where: { slug: prodi.slug },
        update: {},
        create: prodi,
        });
    }
    console.log('Seeding prodi berhasil!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });