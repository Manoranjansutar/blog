import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://manoranjan8bp:AJgsBUlkuSLBIRPf@blogspace.u3aahjp.mongodb.net/?retryWrites=true&w=majority&appName=blogspace').then(()=>{
        console.log('DB connected!!!')
    })
}