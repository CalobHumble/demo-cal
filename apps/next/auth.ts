import NextAuth from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';
import { Eden } from './eden';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      issuer: process.env.AUTH0_ISSUER,
    })],
  events: {
    async signIn(message) {
      if (message.user.id && message.user.email && message.user.name) {
        await Eden.createUser.post({
          id: message.user.id,
          name: message.user.name,
          email: message.user.email
        });
      }
    }
  },
  callbacks: {
    async session({ session, token }) {
      return { ...session, id: token.sub };
    },
  },
})