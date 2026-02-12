
import {mongoose} from 'mongoose';



export const databaseConnection =async () => {

try { 
    const databaseConnectionResult = await mongoose.connect('mongodb+srv://ahmedsaleh112121_db_user:cRkUX0OnonuyvcFc@cluster0.l8qevij.mongodb.net/c45')
    // console.log({databaseConnectionResult});
    console.log("mongoose connected successfully");
    
    
} catch (error) {
    console.log(`fail to connect to DB ${error}`);
    
}
    

}