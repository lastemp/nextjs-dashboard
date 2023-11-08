import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
  try {
    /*
    const user = await sql<User>`SELECT * from USERS where email=${email}`;
    return user.rows[0];
    */
    const user = {
      id: "410544b2-4001-4271-9855-fec4b6a6442a",
      name: "User",
      email: "user@nextmail.com",
      password: "$2b$10$5WdgscAEiTrIXhW5bKndF.HHH3cHynA.IO2rZ4BNR.WpA3RDaTVHe", //i.e encrypted version of "123456"
    };

    if (email === user.email) {
      return user;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          /*
          const saltRounds = 10;
          const password_encrypted = await bcrypt.hash(password, saltRounds);
          // password: "123456"
          // password_encrypted : "$2b$10$5WdgscAEiTrIXhW5bKndF.HHH3cHynA.IO2rZ4BNR.WpA3RDaTVHe"
          console.log("password_encrypted: " + password_encrypted);
          */

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
