const https = require('https');
const querystring = require('querystring');

function fetch(url, method, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'edu.mju.ac.th',
            port: 443,
            path: '/www/studentList.aspx',
            method: method,
            headers: Object.assign({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                // Keep the same session if they use cookies?
            }, postData ? {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            } : {})
        }, res => {
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
    let res = await fetch();
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

    console.log('3. POST click search for 2567, CS (65304010)...');
    res = await fetch('', 'POST', querystring.stringify({
        ...hidden,
        'ctl00$ContentPlaceHolder1$facultydl': '4',
        'ctl00$ContentPlaceHolder1$programdl': '65304010',
        'ctl00$ContentPlaceHolder1$acadyeardl': '2567',
        '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$searchbt', // sometimes button needs EVENTTARGET if it's LinkButton
        'ctl00$ContentPlaceHolder1$searchbt': 'ค้นหา'
    }));
    console.log('POST2 Status:', res.status);
    console.log('Has table?', res.data.includes('table'));
    if (!res.data.includes('table')) {
        console.log('Response Snippet:', res.data.substring(0, 500));
    }
}
run().catch(console.error);
