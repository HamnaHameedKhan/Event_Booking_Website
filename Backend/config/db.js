const mongoose=require('mongoose');
require('dotenv').config();
MONGO_URI='mongodb+srv://hamnahameed24:eventBooking@cluster0.irqhvbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const connectDB= async()=>{
    try {
        await mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log('MongoDB connected');
        
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

module.exports = connectDB;