import { getMysqlConnection } from './mysql';
import { RowDataPacket } from 'mysql2';

export interface NewsItem extends RowDataPacket {
    id: number;
    title: string;
    content: string;
    image: string | null;
    date: string;
}

export interface EventItem extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    image: string | null;
}

export async function getAllNews(): Promise<NewsItem[]> {
    const connection = await getMysqlConnection();
    if (!connection) return [];

    try {
        const [rows] = await connection.execute<NewsItem[]>('SELECT * FROM news');

        // Sort logic
        return rows.sort((a, b) => {
            const parseDate = (dateStr: string) => {
                if (!dateStr) return 0;
                // Handle different date formats if necessary, but standard DB format is preferred
                const d = new Date(dateStr);
                return isNaN(d.getTime()) ? 0 : d.getTime();
            };
            return parseDate(b.date) - parseDate(a.date);
        });
    } catch (error) {
        console.error('Error fetching all news:', error);
        return [];
    } finally {
        await connection.end();
    }
}

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
    const connection = await getMysqlConnection();
    if (!connection) return [];

    try {
        const [rows] = await connection.execute<NewsItem[]>(
            'SELECT * FROM news ORDER BY date DESC LIMIT ?',
            [limit]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching latest news:', error);
        return [];
    } finally {
        await connection.end();
    }
}

export async function getNewsById(id: number): Promise<NewsItem | undefined> {
    const connection = await getMysqlConnection();
    if (!connection) return undefined;

    try {
        const [rows] = await connection.execute<NewsItem[]>('SELECT * FROM news WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error(`Error fetching news by id ${id}:`, error);
        return undefined;
    } finally {
        await connection.end();
    }
}

export async function getUpcomingEvents(limit = 3): Promise<EventItem[]> {
    const connection = await getMysqlConnection();
    if (!connection) return [];

    try {
        // MySQL uses CURDATE() or NOW()
        const [rows] = await connection.execute<EventItem[]>(
            "SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC LIMIT ?",
            [limit]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
    } finally {
        await connection.end();
    }
}
