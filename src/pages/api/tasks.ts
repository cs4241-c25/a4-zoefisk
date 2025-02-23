import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../../server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await connectToDatabase();
        const tasksCollection = db.collection('tasks');

        if (req.method === 'GET') {
            const { userEmail } = req.query;
            if (!userEmail) {
                res.status(400).json({ error: 'Missing userEmail query parameter' });
                return;
            }
            const tasks = await tasksCollection.find({ userEmail }).toArray();
            res.status(200).json(tasks);
        } else if (req.method === 'POST') {
            const newTask = { ...req.body, id: new ObjectId().toString() };
            const result = await tasksCollection.insertOne(newTask);
            res.status(201).json({ _id: result.insertedId, ...newTask });
        } else if (req.method === 'PUT') {
            const { id } = req.query;
            const updatedTask = req.body;

            delete updatedTask._id;

            const result = await tasksCollection.updateOne(
                { id },
                { $set: updatedTask }
            );
            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'Task updated successfully' });
            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        } else if (req.method === 'DELETE') {
            const { id, userEmail } = req.query;
            console.log(req.query);
            if (id) {
                const result = await tasksCollection.deleteOne({ id });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Task deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Task not found' });
                }
            } else if (userEmail) {
                const result = await tasksCollection.deleteMany({ userEmail });
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'All tasks deleted successfully' });
                } else {
                    res.status(404).json({ message: 'No tasks found for the given email' });
                }
            } else {
                res.status(400).json({ error: 'Missing id or userEmail query parameter' });
            }
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}