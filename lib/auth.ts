import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    /* Temporarily disabled per user request
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "phone",
      name: "phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        // Real implementation would verify OTP here via SMS service
        if (credentials?.otp === "123456") { // Simulated OTP for testing
          const user = (await prisma.user.findFirst({
            where: { email: `${credentials.phone}@phone.com` }, // Shadow email for phone users
          })) as any;

          if (!user) {
            // Auto-create user for phone if not exists
            const newUser = await (prisma.user as any).create({
              data: {
                email: `${credentials.phone}@phone.com`,
                name: `User ${credentials.phone.slice(-4)}`,
                passwordHash: "phone-login", // Placeholder
                credits: 10,
                status: "active"
              }
            });
            return { id: newUser.id, name: newUser.name, email: newUser.email };
          }
          return { id: user.id, name: user.name, email: user.email };
        }
        throw new Error("Invalid OTP");
      }
    }),
    */
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })) as any;

        if (!user) {
          throw new Error("No account found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home, we use modals
  },
  secret: process.env.NEXTAUTH_SECRET,
};
