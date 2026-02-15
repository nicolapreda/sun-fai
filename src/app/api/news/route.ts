import { NextResponse } from 'next/server';
import { getMysqlConnection } from '@/lib/mysql';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';

async function isAuthenticated() {
    const cookieStore = await cookies();
    return !!cookieStore.get('admin_session');
}

export async function GET() {
    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        const [rows] = await connection.query('SELECT * FROM news ORDER BY date DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    } finally {
        await connection.end();
    }
}

export async function POST(req: Request) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = Date.now() + '_' + imageFile.name.replaceAll(' ', '_');

        try {
            await writeFile(
                path.join(process.cwd(), 'public/uploads', filename),
                buffer
            );
            imagePath = '/uploads/' + filename;
        } catch (error) {
            console.error('Error saving file:', error);
            // Continue without image or return error? Let's log and continue for now or throw
        }
    }

    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        const [result] = await connection.execute(
            'INSERT INTO news (title, content, date, image) VALUES (?, ?, ?, ?)',
            [title, content, date, imagePath]
        );
        return NextResponse.json({ id: (result as any).insertId, title, content, date, image: imagePath });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    } finally {
        await connection.end();
    }
}
