import mongoose from "mongoose";

export default async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGO_DB_URL || '')
        console.log('Connected to mongodb')
    } catch (error) {
        console.log(error)
    }
}