import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try{
        const dbURI = process.env.dbURI || 'mongodb://127.0.0.1:27017/Medium';
        await mongoose.connect(dbURI);
        console.log("MongoDb connected successfully!")
    } catch (error) {
        console.error("Error connecting to mongoDB: ", error);
        process.exit(1);
    }
}

export default connectDB;
