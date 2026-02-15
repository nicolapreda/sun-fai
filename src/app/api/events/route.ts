import { NextResponse } from 'next/server';
import { getMysqlConnection } from '@/lib/mysql';
import { cookies } from 'next/headers';

async function isAuthenticated() {
    const cookieStore = await cookies();
    return !!cookieStore.get('admin_session');
}

export async function GET() {
    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        const [rows] = await connection.execute('SELECT * FROM events ORDER BY date ASC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    } finally {
        await connection.end();
    }
}

export async function POST(req: Request) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;

    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        const [result] = await connection.execute(
            'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)',
            [title, description, date, time, location]
        );
        return NextResponse.json({ id: (result as any).insertId, title, description, date, time, location });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
