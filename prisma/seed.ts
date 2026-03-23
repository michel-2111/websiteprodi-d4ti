import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('Admin123!', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@polimdo.ac.id' },
        update: {},
        create: {
        email: 'admin@polimdo.ac.id',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'ADMIN',
        },
    })
    console.log('Akun admin berhasil dibuat:', admin.email)
    }

    main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })