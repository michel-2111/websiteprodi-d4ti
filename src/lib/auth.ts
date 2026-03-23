import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
            throw new Error("Email dan password harus diisi");
            }

            const user = await prisma.user.findUnique({
            where: { email: credentials.email }
            });

            if (!user) {
            throw new Error("Email tidak ditemukan");
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
            throw new Error("Password salah");
            }

            return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            };
        }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.role = user.role;
            token.id = user.id;
        }
        return token;
        },
        async session({ session, token }) {
        if (token && session.user) {
            session.user.role = token.role as string;
            session.user.id = token.id as string;
        }
        return session;
        }
    },
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET,
};