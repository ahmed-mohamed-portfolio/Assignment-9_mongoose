
import { mongoose } from 'mongoose';
import { DB_URL } from "../../config/index.js";



export const databaseConnection = async () => {

    try {

        const databaseConnectionResult = await mongoose.connect(DB_URL)
        console.log("mongoose connected successfully");

    } catch (error) {

        console.log(`fail to connect to DB ${error}`);

    }


}