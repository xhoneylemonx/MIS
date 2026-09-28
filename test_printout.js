const https = require('https');
https.get('https://edu.mju.ac.th/www/studentListPrintOut.aspx?programid=65304010&admitacadyear=2567', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        require('fs').writeFileSync('printout.html', data);
        console.log('Saved printout.html, Length:', data.length);
        const match = data.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
        if (match) {
            console.log('TABLE FOUND!');
            const rows = [...match[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
            console.log('Rows:', rows.length);
            if (rows.length > 2) {
                const cols = [...rows[1][1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
                console.log('Headers:', cols.join(' | '));
                const cols2 = [...rows[2][1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
                console.log('Row 1:', cols2.join(' | '));
            }
        } else {
            console.log('NO TABLE');
        }
    });
});
