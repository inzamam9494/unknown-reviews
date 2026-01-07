import NextAuth from "next-auth";
import { authOption } from "@/src/app/api/auth/[...nextauth]/options";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };