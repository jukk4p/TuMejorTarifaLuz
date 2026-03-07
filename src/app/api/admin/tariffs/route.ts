import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, index, payload } = body;

        const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

        // Read current data
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        let tariffs = JSON.parse(fileData);

        if (action === 'add') {
            tariffs.push(payload);
        } else if (action === 'update' && typeof index === 'number') {
            tariffs[index] = payload;
        } else if (action === 'delete' && typeof index === 'number') {
            tariffs.splice(index, 1);
        } else {
            return NextResponse.json({ error: 'Invalid action or parameters' }, { status: 400 });
        }

        // Write back to file
        fs.writeFileSync(dataFilePath, JSON.stringify(tariffs, null, 2));

        return NextResponse.json({ success: true, message: `Tariff ${action}ed successfully` });
    } catch (error) {
        console.error('Error updating tariffs:', error);
        return NextResponse.json({ error: 'Error modifying tariffs datastore' }, { status: 500 });
    }
}
