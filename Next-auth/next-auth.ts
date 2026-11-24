import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOP: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
                    });
                    const result = await response.json();
                    if (!response.ok || !result.user || !result.token) return null;
                    return { id: result.user._id ?? result.user.email, name: result.user.name, email: result.user.email, token: result.token };
                } catch {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as typeof user & { token?: string }).token;
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken as string | undefined;
                session.user.id = typeof token.userId === "string" ? token.userId : token.sub;
            }
            return session;
        },
    },
};
