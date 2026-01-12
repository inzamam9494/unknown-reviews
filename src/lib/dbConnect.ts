import mongoose  from 'mongoose';

type ConnectionObject = {
    isConnection?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnection) {
        console.log('Already connected to the database. Keep going...');
        return;
    }

    try {
        const uri = process.env.MONGODB_URI?.trim() || '';
        if (!uri) {
            throw new Error('Missing MONGODB_URI environment variable. Ensure .env (or .env.local) exists at the project root and restart the dev server.');
        }

        const db = await mongoose.connect(uri, {})
        connection.isConnection = db.connections[0].readyState;

        console.log('DB connected successfully');
        console.log(connection.isConnection);
        console.log(db);
        
    } catch (error) {
        console.log('DB connection failed:', error);
        process.exit(1);
    }
}

export default dbConnect;