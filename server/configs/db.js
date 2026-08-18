import mongoose from "mongoose";

const connectDB = async (retries = 5) => {
    while (retries > 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("Database connected");
            return;
        } catch (error) {
            retries -= 1;
            console.error(`Database connection failed: ${error.message}. Retries left: ${retries}`);
            if (retries === 0) {
                console.error("Could not connect to database. Exiting...");
                process.exit(1);
            }
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

export default connectDB;