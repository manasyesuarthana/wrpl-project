import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config'; // Make sure this is at the top to load .env variables

import { countryIdsTable } from './schema.js';
import { countryIds as countriesToSeed } from './country_id_seed.js'; // Or './country_id_seed.ts'

async function seedDatabase() {
    console.log("Starting database seeding process...");

    if (!process.env.DATABASE_URL) {
        console.error("FATAL ERROR: DATABASE_URL is not set in your .env file.");
        process.exit(1);
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        const db = drizzle(sql);

        console.log("Connected to the database.");
        console.log(`Found ${countriesToSeed.length} countries to seed.`);

        if (countriesToSeed.length === 0) {
            console.warn("WARNING: No countries found in the seed file. Nothing to seed for countries.");
            return;
        }

        console.log("Seeding country_ids table...");
        
        // Using Drizzle's batch insert.
        // .onConflictDoNothing() is a PostgreSQL-specific clause that will skip inserting a row
        // if a row with the same primary key (country_id) already exists.
        // This makes the script safe to run multiple times.
        const result = await db.insert(countryIdsTable)
            .values(countriesToSeed)
            .onConflictDoNothing() // Important for re-runnability
            .returning(); // Optional: to see what was actually inserted or if onConflict needs it

        console.log(`SUCCESS: Seeding complete for country_ids table.`);
        if (result && result.length > 0) {
            console.log(`Inserted/updated ${result.length} country records.`);
        } else if (result) {
             console.log(`No new country records were inserted (they might already exist).`);
        }

    } catch (error) {
        console.error("ERROR: Error during database seeding:", error);
        process.exit(1); // Exit with an error code
    } finally {
        console.log("Database seeding process finished.");
    }
}

seedDatabase();