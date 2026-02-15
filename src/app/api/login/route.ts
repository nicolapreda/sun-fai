import { NextResponse } from 'next/server';
import { getMysqlConnection } from '@/lib/mysql';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const connection = await getMysqlConnection();
    if (!connection) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        const users = rows as any[];
        const user = users[0];

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_session', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ message: 'Login successful' });
        } else {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await connection.end();
    }
}
