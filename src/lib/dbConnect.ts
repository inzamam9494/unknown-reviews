import moongoose from 'mongoose';

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
        const db = await moongoose.connect(process.env.MONGODB_URI || '', {})
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