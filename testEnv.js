import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Print environment variables
console.log("RUNRIDE_DB_URI:", process.env.RUNRIDE_DB_URI);
console.log("RUNRIDE_COLLECTION:", process.env.RUNRIDE_COLLECTION);
console.log("PORT:", process.env.PORT);