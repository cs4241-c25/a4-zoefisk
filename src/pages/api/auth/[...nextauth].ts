import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../../server";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string | null;
        };
    }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    if (req.method === 'OPTIONS') {
        return;
    }

    return NextAuth(req, res, {
        providers: [
            GitHubProvider({
                clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
                clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
            }),
            GoogleProvider({
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
            })
        ],
        secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
        pages: {
            signOut: '/auth/signout',
            error: '/auth/error',
            newUser: undefined // If set to undefined, new users will be directed to the home page
        },
        callbacks: {
            async signIn({ user }) {
                const { email } = user;

                if (!email) {
                    console.log('Email is required');
                    return false;
                }

                const db = await connectToDatabase();
                const usersCollection = db.collection('users');

                // Check if user already exists
                const existingUser = await usersCollection.findOne({ email });
                if (existingUser) {
                    return true;
                }

                const username = email.split('@')[0];
                const newUser = { email, username, id: new ObjectId().toString() };
                await usersCollection.insertOne(newUser);

                return true;
            },
            async redirect({ url, baseUrl }) {
                return '/todo';
            },
            async session({ session, token }) {
                const db = await connectToDatabase();
                const usersCollection = db.collection('users');
                const user = await usersCollection.findOne({ email: token.email });

                if (user) {
                    if (!session.user) {
                        session.user = {};
                    }
                    session.user.username = user.username;
                }

                return session;
            },
            async jwt({ token, user }) {
                if (user) {
                    token.email = user.email;
                }
                return token;
            }
        }
    });
}