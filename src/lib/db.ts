import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Singleton connection
let db: Database | null = null;

export async function getDb() {
    if (db) return db;

    const filename = path.join(process.cwd(), 'database.sqlite');

    db = await open({
        filename,
        driver: sqlite3.Database
    });

    return db;
}
