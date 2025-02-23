import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is not defined");
}

if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error("Invalid MongoDB URI scheme. Expected connection string to start with 'mongodb://' or 'mongodb+srv://'");
}

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('a3-zoefisk'); // Use the correct database name here
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB: ', error);
        throw error;
    }
}

export default connectToDatabase;