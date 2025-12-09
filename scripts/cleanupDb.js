import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function cleanupDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/faceAuth");
        console.log("Connected!");

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Get all indexes
        console.log("\nCurrent indexes:");
        const indexes = await collection.indexes();
        console.log(JSON.stringify(indexes, null, 2));

        // Drop the problematic email index if it exists
        try {
            await collection.dropIndex('email_1');
            console.log("\n✓ Dropped email_1 index");
        } catch (err) {
            if (err.code === 27) {
                console.log("\n✓ email_1 index doesn't exist (already clean)");
            } else {
                console.log("\n✗ Error dropping email_1 index:", err.message);
            }
        }

        // Show final indexes
        console.log("\nFinal indexes:");
        const finalIndexes = await collection.indexes();
        console.log(JSON.stringify(finalIndexes, null, 2));

        console.log("\n✓ Database cleanup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

cleanupDatabase();