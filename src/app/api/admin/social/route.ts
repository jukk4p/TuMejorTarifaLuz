import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const webhookUrl = process.env.SOCIAL_WEBHOOK_URL;

        if (!webhookUrl) {
            console.warn("SOCIAL_WEBHOOK_URL not configured. Skipping social post.");
            return NextResponse.json({ success: false, error: 'Webhook URL not configured' }, { status: 500 });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                source: 'TuMejorTarifaLuz_Admin',
                timestamp: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error(`Social Webhook failed with status: ${response.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in social media dispatcher:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
