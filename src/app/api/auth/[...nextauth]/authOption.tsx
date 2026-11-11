/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants";
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken: string | unknown;
    user: {
      id: string;
      role: string;
      isSelfTenant?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken?: string;
    isSelfTenant?: boolean;
  }
}

export const authoption: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: ROUTES.Landing,
    signOut: ROUTES.Landing,
    error: ROUTES.Login,
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
              role_id: credentials.role,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.message || "Invalid credentials");
          }

          if (!data.user || !data.token) {
            console.error("Invalid response structure");
            return null;
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(`${error}`);
        }
      },
    }),
    CredentialsProvider({
      id: "impersonation",
      name: "Impersonation",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          throw new Error("Missing token");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/impersonation/status`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${credentials.token}`,
            },
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data?.message || "Invalid impersonation token");
          }

          const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${credentials.token}`,
            },
          });

          const profileData = await profileRes.json();

          if (!profileRes.ok || !profileData.user) {
            throw new Error("Failed to fetch profiles for impersonated user");
          }

          return {
            id: profileData.user.id,
            name: profileData.user.name,
            email: profileData.user.email,
            role: profileData.user.role,
            accessToken: credentials.token,
            isImpersonated: data.isImpersonating,
            isSelfTenant: data.isSelfTenant,
          };
        } catch (error) {
          console.error("Impersonation authorization error:", error);
          throw new Error(`${error}`);
        }
      },
    }),
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.isImpersonated = (user as any).isImpersonated ?? false;
        token.isSelfTenant = (user as any).isSelfTenant ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken;
        (session as any).isImpersonated = token.isImpersonated;
        (session as any).isSelfTenant = token.isSelfTenant;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {
        console.error("Failed to parse redirect URL:", url, e);
      }
      return `${baseUrl}${ROUTES.Dashboard}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
