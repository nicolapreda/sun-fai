import { NextResponse } from 'next/server';
import { getInstantPowers } from '@/lib/services/ardake';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getInstantPowers();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
