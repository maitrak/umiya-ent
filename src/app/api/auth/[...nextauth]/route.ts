import NextAuth from "next-auth";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ phone: credentials?.phone });
          if (!user) {
            throw new Error("");
          }
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            throw new Error("");
          }
          return user;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // async session({ session, token, user }) {
    //   console.log("session", session, token, user);
    //   // Add custom data to session
    // //   session.user.id = token.sub; // Example: Add user ID from JWT tokenreturn session;
    // },
    async signIn() {
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const customUser = user as typeof user & { phone: string; role: string };
        token.id = customUser.id;
        token.phone = customUser.phone;
        token.role = customUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...(session.user ?? {}),
          ...(token ?? {}),
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
