const https = require('https');
const querystring = require('querystring');

let theCookies = [];

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
            },
                theCookies.length ? { 'Cookie': theCookies.join('; ') } : {},
                postData ? {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                } : {})
        }, res => {
            if (res.headers['set-cookie']) {
                res.headers['set-cookie'].forEach(c => {
                    const cookieStr = c.split(';')[0];
                    if (!theCookies.includes(cookieStr)) theCookies.push(cookieStr);
                });
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, data }));
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
    let res = await fetch('', 'GET');
    console.log('GET Status:', res.status);
    let hidden = extractHidden(res.data);

    console.log('2. POST change faculty to 4...');
    res = await fetch('', 'POST', querystring.stringify({
        ...hidden,
        '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$facultydl',
        '__EVENTARGUMENT': '',
        'ctl00$ContentPlaceHolder1$facultydl': '4',
    }));
    console.log('POST1 Status:', res.status);
    hidden = extractHidden(res.data);

    console.log('3. POST click search for 2566, CS (65304010)...');
    res = await fetch('', 'POST', querystring.stringify({
        ...hidden,
        'ctl00$ContentPlaceHolder1$facultydl': '4',
        'ctl00$ContentPlaceHolder1$programdl': '65304010',
        'ctl00$ContentPlaceHolder1$acadyeardl': '2566',
        // In WebForms, if it's a real submit button, typically we just pass the button's name/value
        // If it's a link button, we use __EVENTTARGET. 'searchbt' is an input type="submit".
        'ctl00$ContentPlaceHolder1$searchbt': 'ค้นหา'
    }));
    console.log('POST2 Status:', res.status);
    console.log('Has table?', res.data.includes('table'));

    const tableMatch = res.data.match(/<table[^>]*class="table"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
        console.log('NO TABLE FOUND!');
        console.log('Snippet:', res.data.substring(0, 250));
    } else {
        const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
        console.log(`Found table with ${rows.length} rows (including header).`);
        if (rows.length > 2) {
            const cols = [...rows[1][1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
            console.log('Row 1:', cols.join(' | '));
        }
    }
}
run().catch(console.error);
