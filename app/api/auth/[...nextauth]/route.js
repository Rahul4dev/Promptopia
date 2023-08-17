import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      // store the userId from the MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // every NextJS route is a serverless route, serverless => lambda function, only execute when it is called. i.e to make the connection to the database on every execution.
      try {
        await connectToDB();
        console.log('signing in');
        // check if a user already exists

        const userExists = await User.findOne({ email: profile?.email });
        // if not, create a new user
        if (userExists === null) {
          await User.create({
            email: profile.email,
            username: profile?.name.replace(/\s+/g, '').toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log('Error checking if user exists: ', error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
