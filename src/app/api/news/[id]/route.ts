import { NextResponse } from 'next/server';
import { getMysqlConnection } from '@/lib/mysql';
import { cookies } from 'next/headers';

async function isAuthenticated() {
    const cookieStore = await cookies();
    return !!cookieStore.get('admin_session');
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;

    const connection = await getMysqlConnection();
    if (!connection) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    try {
        await connection.execute('UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?', [title, content, date, id]);
        return NextResponse.json({ message: 'Updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    } finally {
        await connection.end();
    }
}
