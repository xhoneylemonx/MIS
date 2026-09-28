const https = require('https');
const querystring = require('querystring');

https.get('https://edu.mju.ac.th/www/studentList.aspx', (res) => {
    let get_data = '';
    res.on('data', (c) => get_data += c);
    res.on('end', () => {
        let viewState = get_data.match(/id="__VIEWSTATE" value="([^"]+)"/)[1];
        let viewGen = get_data.match(/id="__VIEWSTATEGENERATOR" value="([^"]+)"/)[1];
        let eventValid = get_data.match(/id="__EVENTVALIDATION" value="([^"]+)"/)[1];

        // get cookies
        let cookies = res.headers['set-cookie'];

        let postData = querystring.stringify({
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            __VIEWSTATE: viewState,
            __VIEWSTATEGENERATOR: viewGen,
            __EVENTVALIDATION: eventValid,
            'ctl00$ContentPlaceHolder1$facultydl': '4',
            'ctl00$ContentPlaceHolder1$programdl': '65304010',
            'ctl00$ContentPlaceHolder1$acadyeardl': '2566',
            'ctl00$ContentPlaceHolder1$Button1': 'ตกลง'
        });

        let options = {
            hostname: 'edu.mju.ac.th',
            path: '/www/studentList.aspx',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'Cookie': cookies ? cookies.map(c => c.split(';')[0]).join('; ') : ''
            }
        };

        let req = https.request(options, (res2) => {
            let post_res_data = '';
            res2.on('data', (c) => post_res_data += c);
            res2.on('end', () => {
                const fs = require('fs');
                fs.writeFileSync('result_dump.html', post_res_data);
                console.log('Saved result to result_dump.html (with cookies)');
            });
        });
        req.write(postData);
        req.end();
    });
});
