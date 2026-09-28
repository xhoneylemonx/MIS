const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

function fetch(url, method, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'edu.mju.ac.th',
            port: 443,
            path: '/www/studentList.aspx',
            method: method,
            headers: Object.assign({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;'
            }, postData ? {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            } : {})
        }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

function extractHidden(html) {
    const hidden = {};
    const inputs = [...html.matchAll(/<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]*id="[^"]+"(?:[^>]*value="([^"]*)")?/gi)];
    inputs.forEach(m => hidden[m[1]] = m[2] || '');
    return hidden;
}

async function run() {
    console.log('1. GET initial page...');
    let html = await fetch();
    let hidden = extractHidden(html);

    console.log('2. POST change faculty to 4...');
    html = await fetch('', 'POST', querystring.stringify({
        ...hidden,
        '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$facultydl',
        '__EVENTARGUMENT': '',
        'ctl00$ContentPlaceHolder1$facultydl': '4',
    }));
    hidden = extractHidden(html);

    console.log('3. POST click search for 2567, CS (65304010)...');
    html = await fetch('', 'POST', querystring.stringify({
        ...hidden,
        'ctl00$ContentPlaceHolder1$facultydl': '4',
        'ctl00$ContentPlaceHolder1$programdl': '65304010',
        'ctl00$ContentPlaceHolder1$acadyeardl': '2567',
        'ctl00$ContentPlaceHolder1$searchbt': 'ค้นหา'
    }));

    fs.writeFileSync('reg_result.html', html);
    const tableMatch = html.match(/<table[^>]*class="table"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
        console.log('NO TABLE FOUND!');
        return;
    }
    const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    console.log(`Found table with ${rows.length} rows (including header).`);
    if (rows.length > 2) {
        console.log('First student row:');
        const cols = [...rows[1][1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        console.log(cols.join(' | '));
    }
}
run().catch(console.error);
