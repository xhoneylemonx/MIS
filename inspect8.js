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

function extractAllFields(html) {
    const fields = {};
    const inputs = [...html.matchAll(/<input[^>]+name="([^"]+)"[^>]*>/gi)];
    inputs.forEach(m => {
        const name = m[1];
        if (m[0].match(/type="(?:submit|button|image)"/i)) return; // skip buttons by default
        const valMatch = m[0].match(/value="([^"]*)"/);
        fields[name] = valMatch ? valMatch[1] : '';
    });

    // Selects
    const cheer = html.split('<select');
    for (let i = 1; i < cheer.length; i++) {
        const chunk = cheer[i].split('</select>')[0];
        const nameMatch = chunk.match(/name="([^"]+)"/i);
        if (nameMatch) {
            const name = nameMatch[1];
            const selected = chunk.match(/<option[^>]+selected="selected"[^>]+value="([^"]*)"/);
            if (selected) {
                fields[name] = selected[1];
            } else {
                const first = chunk.match(/<option[^>]+value="([^"]*)"/);
                fields[name] = first ? first[1] : '';
            }
        }
    }
    return fields;
}

async function run() {
    console.log('1. GET initial page...');
    let res = await fetch('', 'GET');
    console.log('GET Status:', res.status);
    let fields = extractAllFields(res.data);

    console.log('2. POST change faculty to 4...');
    const post1 = { ...fields, '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$facultydl', 'ctl00$ContentPlaceHolder1$facultydl': '4' };
    res = await fetch('', 'POST', querystring.stringify(post1));
    console.log('POST1 Status:', res.status);

    fields = extractAllFields(res.data);

    console.log('3. POST click search for CS (65304010) in 2567...');
    const post2 = {
        ...fields,
        '__EVENTTARGET': '', // Clear since we use submit button
        '__EVENTARGUMENT': '',
        'ctl00$ContentPlaceHolder1$facultydl': '4',
        'ctl00$ContentPlaceHolder1$programdl': '65304010',
        'ctl00$ContentPlaceHolder1$acadyeardl': '2567',
        'ctl00$ContentPlaceHolder1$Button1': 'ตกลง'
    };

    res = await fetch('', 'POST', querystring.stringify(post2));
    console.log('POST2 Status:', res.status);
    fs.writeFileSync('post2_full.html', res.data);

    const tableMatch = res.data.match(/<table[^>]*class="table[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
        console.log('NO TABLE FOUND!');
        if (res.data.match(/ไม่พบข้อมูล/)) {
            console.log('FOUND TEXT: ไม่พบข้อมูล (No Data)');
        }
    } else {
        const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
        console.log(`Found table with ${rows.length} rows (including header).`);
        for (let i = 1; i < Math.min(4, rows.length); i++) {
            const cols = [...rows[i][1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
            console.log(`Row ${i}:`, cols.join(' | '));
        }
    }
}
run().catch(console.error);
