import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || '3306')
};

export async function getMysqlConnection() {
    try {
        return await mysql.createConnection(dbConfig);
    } catch (error) {
        console.error('Database connection failed:', (error as Error).message);
        return null;
    }
}
