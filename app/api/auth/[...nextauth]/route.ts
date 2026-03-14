import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
<<<<<<< HEAD

=======
>>>>>>> origin/main
export { handler as GET, handler as POST };
