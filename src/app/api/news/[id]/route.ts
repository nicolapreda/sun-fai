import { NextResponse } from 'next/server';
import { getMysqlConnection } from '@/lib/mysql';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function isAuthenticated() {
    const cookieStore = await cookies();
    return !!cookieStore.get('admin_session');
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        await connection.execute('DELETE FROM news WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    } finally {
        await connection.end();
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = Date.now() + '_' + imageFile.name.replaceAll(' ', '_');
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        try {
            await mkdir(uploadDir, { recursive: true });
            await writeFile(path.join(uploadDir, filename), buffer);
            imagePath = '/uploads/' + filename;
            console.log(`Saved image to ${path.join(uploadDir, filename)}`);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }

    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        if (imagePath) {
            await connection.execute('UPDATE news SET title = ?, content = ?, date = ?, image = ? WHERE id = ?', [title, content, date, imagePath, id]);
        } else {
            await connection.execute('UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?', [title, content, date, id]);
        }
        return NextResponse.json({ message: 'Updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    } finally {
        await connection.end();
    }
}
