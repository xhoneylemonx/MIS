const https = require('https');
https.get('https://edu.mju.ac.th/www/studentList.aspx', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const fs = require('fs');
        fs.writeFileSync('reg.html', data);
        console.log('Saved to reg.html, Length:', data.length);
        console.log('Form Inputs (Initial Load):');
        const hiddenInputs = [...data.matchAll(/<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+id="([^"]+)"[^>]+value="([^"]*)"/g)];
        hiddenInputs.forEach(m => console.log(m[1], '=', m[3].substring(0, 50) + '...'));

        const views = data.match(/__VIEWSTATE\|([^|]+)/g);
        if (views) console.log('Found async VIEWSTATE');
    });
}).on('error', console.error);
