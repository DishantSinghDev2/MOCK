import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "whatsyourinfo",
      name: "WhatsYour.Info",
      type: "oauth",
      authorization: {
        url: "https://api.whatsyour.info/oauth/authorize",
        params: {
          scope: "read:user read:email",
          response_type: "code",
        },
      },
      token: "https://api.whatsyour.info/oauth/token",
      userinfo: "https://api.whatsyour.info/api/user",
      clientId: process.env.WHATSYOURINFO_CLIENT_ID,
      clientSecret: process.env.WHATSYOURINFO_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.userId = token.userId as string
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".dishis.tech" : undefined,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".dishis.tech" : undefined,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".dishis.tech" : undefined,
      },
    },
  },
  trustHost: true,
}
