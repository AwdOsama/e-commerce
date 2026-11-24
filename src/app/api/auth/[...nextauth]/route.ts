import NextAuth from "next-auth";
import { authOP } from "../../../../../Next-auth/next-auth";

const handler = NextAuth(authOP);

export { handler as GET, handler as POST };
