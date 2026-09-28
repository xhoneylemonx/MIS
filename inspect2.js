const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

const html = fs.readFileSync('reg.html', 'utf8');

// Extract all hidden fields
const hiddenFields = {};
const inputs = [...html.matchAll(/<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+id="[^"]+"[^>]*value="([^"]*)"/gi)];
inputs.forEach(m => hiddenFields[m[1]] = m[2]);

// Empty value hidden fields might exist without value attribute
const inputs2 = [...html.matchAll(/<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+id="[^"]+"(\s*\/)?>/gi)];
inputs2.forEach(m => {
    if (!hiddenFields[m[1]]) hiddenFields[m[1]] = '';
});

// Build postback body to change Faculty
const postData = querystring.stringify({
    ...hiddenFields,
    '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$facultydl',
    '__EVENTARGUMENT': '',
    'ctl00$ContentPlaceHolder1$facultydl': '4', // วิทยาศาสตร์
    'ctl00$ContentPlaceHolder1$acadyeardl': '2567',
    'ctl00$ContentPlaceHolder1$programdl': '691010119', // Just send whatever was default to avoid ASP.NET validation error
    'ctl00$ContentPlaceHolder1$searchbt': ''
});

const req = https.request({
    hostname: 'edu.mju.ac.th',
    port: 443,
    path: '/www/studentList.aspx',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
}, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
        fs.writeFileSync('reg_faculty4.html', raw);
        console.log('Saved to reg_faculty4.html, length:', raw.length);

        const chunk = raw.split('<select').find(c => c.includes('name="ctl00$ContentPlaceHolder1$programdl"'));
        if (chunk) {
            const options = [...chunk.split('</select>')[0].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]+)<\/option>/gi)];
            console.log('Programs under Faculty 4:');
            options.forEach(o => {
                if (o[2].includes('วิทยาการคอมพิวเตอร์')) {
                    console.log(`!!! MATCH !!! Value: "${o[1]}", Text: "${o[2].trim()}"`);
                }
            });
        }
    });
});

req.on('error', console.error);
req.write(postData);
req.end();
