import { NextResponse } from 'next/server';
import { getElectricityPrices } from '@/lib/electricity-prices';

export async function GET() {
    try {
        const data = await getElectricityPrices();
        if (!data) {
            return NextResponse.json({ error: "Failed to fetch electricity prices" }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
