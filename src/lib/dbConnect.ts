/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";


type ConnectionObject = {
    isConnected: number;
}

const connection:ConnectionObject  = {
    isConnected: 0
}

const dbConnect = async ()=>{
    if(connection.isConnected){
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})

        connection.isConnected = db.connections[0].readyState;
        console.log('Connection to DB established');
    } catch (error) {
        console.error('Error connecting to DB:',error);
        process.exit(1);
    }
}



