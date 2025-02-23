import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../../server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const tasksCollection = db.collection('tasks');

        if (req.method === 'POST') {
            const { email, backgroundImage } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const username = email.split('@')[0];
            const newUser = { ...req.body, username, id: new ObjectId().toString(), backgroundImage: backgroundImage || '/ocean.jpg' };

            const result = await usersCollection.insertOne(newUser);
            res.status(201).json({ _id: result.insertedId, ...newUser });
        } else if (req.method === 'PUT') {
            const { email, backgroundImage } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const result = await usersCollection.updateOne(
                { email },
                { $set: { backgroundImage } }
            );

            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'Background image updated successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } else if (req.method === 'GET') {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const user = await usersCollection.findOne({ email });

            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } else if (req.method === 'DELETE') {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const userResult = await usersCollection.deleteOne({ email });
            const tasksResult = await tasksCollection.deleteMany({ userEmail: email });

            if (userResult.deletedCount === 1) {
                res.status(200).json({ message: 'User and associated tasks deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } else {
            res.setHeader('Allow', ['POST', 'PUT', 'GET', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Failed to handle request', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}