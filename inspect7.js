const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

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
        'ctl00$ContentPlaceHolder1$Button1': 'ตกลง' // Sometimes we don't send the button in postbacks triggered by dropdowns, but it's okay, maybe omit it here.
    }));

    // Oh, wait! For the faculty change postback, we shouldn't send the Button1! 
    // And what was acadyeardl default? 2567 probably? Let's just pass whatever was in the first response or omit it. 
    // Usually ASP.NET requires all visible form fields! Let's extract them from the first response.

    // Wait, let's just parse the actual state after step 1
    const getDropdownVal = (html, name) => {
        const sel = html.match(new RegExp(`<select[^>]+name="${name.replace(/\$/g, '\\$')}"[^>]*>([\\s\\S]*?)</select>`));
        if (!sel) return '';
        const selected = sel[1].match(/<option[^>]+selected="selected"[^>]+value="([^"]*)"/);
        return selected ? selected[1] : (sel[1].match(/<option[^>]+value="([^"]*)"/) || [])[1];
    };

    const postData1 = {
        ...hidden,
        '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$facultydl',
        '__EVENTARGUMENT': '',
        'ctl00$ContentPlaceHolder1$facultydl': '4',
        'ctl00$ContentPlaceHolder1$acadyeardl': getDropdownVal(res.data, 'ctl00$ContentPlaceHolder1$acadyeardl'),
        'ctl00$ContentPlaceHolder1$programdl': getDropdownVal(res.data, 'ctl00$ContentPlaceHolder1$programdl')
    };

    console.log('POST1 Data keys:', Object.keys(postData1).length);
    res = await fetch('', 'POST', querystring.stringify(postData1));
    console.log('POST1 Status:', res.status);

    hidden = extractHidden(res.data);

    console.log('3. POST click search for CS (65304010) in 2567...');
    const postData2 = {
        ...hidden,
        '__EVENTTARGET': '',
        '__EVENTARGUMENT': '',
        'ctl00$ContentPlaceHolder1$facultydl': '4',
        'ctl00$ContentPlaceHolder1$acadyeardl': '2567',
        'ctl00$ContentPlaceHolder1$programdl': '65304010',
        'ctl00$ContentPlaceHolder1$txtstuId': '',
        'ctl00$ContentPlaceHolder1$txtname': '',
        'ctl00$ContentPlaceHolder1$Button1': 'ตกลง'
    };

    console.log('POST2 keys length:', Object.keys(postData2).length);
    res = await fetch('', 'POST', querystring.stringify(postData2));
    console.log('POST2 Status:', res.status);
    fs.writeFileSync('post2_full.html', res.data); // save full output to inspect

    const tableMatch = res.data.match(/<table[^>]*class="table"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
        console.log('NO TABLE FOUND!');
        const grid = res.data.match(/<table[^>]*id="[^"]*grid[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
        if (grid) console.log('Found grid table?', true);
        console.log('ไม่พบข้อมูล (No Data)?', !!res.data.match(/ไม่พบข้อมูล/));
    } else {
        const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
        console.log(`Found table with ${rows.length} rows (including header).`);
        if (rows.length > 1) {
            const cols = [...rows[1][1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
            console.log('Row 1:', cols.join(' | '));
        }
    }
}
run().catch(console.error);
