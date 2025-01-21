import mongoose from 'mongoose';

 const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://blogwebapp:AYWPRStAk9jlk5Do@helpdesk.jri7l.mongodb.net/Helpdesk");
        console.log( 'MongoDB connected' );
    } catch ( error ) {
        console.error( 'Error connecting to MongoDB:', error.message );
        process.exit( 1 );
    }
};

export default connectDB;