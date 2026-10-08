import mongoose from "mongoose";

export async function connect() {

    try {

        await mongoose.connect(process.env.MONGO_URI as string);

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Mongoose connected to the database.");
        });

        connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
            process.exit();
        });

    } catch (error) {

        console.log("Error connecting to the database:", error);

    }
}