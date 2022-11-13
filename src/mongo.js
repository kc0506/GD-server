import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';

export const mongo = {
    connect: () => {
        // dotenv.config();
        // if (!process.env.MONGO_URL) {
        //     console.error("Missing MONGO_URL!!!");
        //     process.exit(1);
        // }
        // const MONGO_URL = process.env.MONGO_URL;

        const MONGO_URL = "mongodb+srv://kc0506q:a9939882600@cluster0.n6wrcg9.mongodb.net/test";

        mongoose.connect(
            MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        ).then((res) => console.log("MongoDB connection created."))
        mongoose.connection.on('error',
            console.error.bind(console, 'connection error:'))
    },
}