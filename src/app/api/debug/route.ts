import { NextResponse } from 'next/server';
import { getMysqlConnection } from '@/lib/mysql';

export async function GET() {
    const connection = await getMysqlConnection();
    if (!connection) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const results: any = {};

    try {
        // 1. Basic Count
        const [count] = await connection.query('SELECT COUNT(*) as count FROM news');
        results.count = count;

        // 2. Test the query used in getLatestNews
        try {
            const [latestNews] = await connection.query(
                `SELECT * FROM news ORDER BY date DESC LIMIT 3`
            );
            results.latestNewsQuery = "SUCCESS";
            results.latestNewsData = latestNews;
        } catch (e) {
            results.latestNewsQuery = "FAILED";
            results.latestNewsError = (e as Error).message;
        }

        // 3. Test getAllNews query (which works)
        try {
            const [allNews] = await connection.execute('SELECT * FROM news');
            results.allNewsQuery = "SUCCESS";
            results.allNewsCount = (allNews as any[]).length;
            results.firstNewsItem = (allNews as any[])[0]; // Check structure
        } catch (e) {
            results.allNewsQuery = "FAILED";
            results.allNewsError = (e as Error).message;
        }

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
