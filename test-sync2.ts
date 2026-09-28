import { POST } from './src/app/api/admin/sync-reg/route';
import { NextRequest } from 'next/server';

async function run() {
    console.log("Testing POST /api/admin/sync-reg");
    
    const req = new NextRequest('http://localhost/api/admin/sync-reg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entryYear: '2566' })
    });
    
    try {
        const res = await POST(req);
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch(e) {
        console.error("Fatal Error:", e);
    }
}

run();
