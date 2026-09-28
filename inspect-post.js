const https = require('https');
const querystring = require('querystring');

https.get('https://edu.mju.ac.th/www/studentList.aspx', (res) => {
    let get_data = '';
    res.on('data', (c) => get_data += c);
    res.on('end', () => {
        let viewState = get_data.match(/id="__VIEWSTATE" value="([^"]+)"/)[1];
        let viewGen = get_data.match(/id="__VIEWSTATEGENERATOR" value="([^"]+)"/)[1];
        let eventValid = get_data.match(/id="__EVENTVALIDATION" value="([^"]+)"/)[1];

        let postData = querystring.stringify({
            __EVENTTARGET: 'ctl00$ContentPlaceHolder1$facultydl',
            __EVENTARGUMENT: '',
            __VIEWSTATE: viewState,
            __VIEWSTATEGENERATOR: viewGen,
            __EVENTVALIDATION: eventValid,
            'ctl00$ContentPlaceHolder1$facultydl': '4'
        });

        let options = {
            hostname: 'edu.mju.ac.th',
            path: '/www/studentList.aspx',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let req = https.request(options, (res2) => {
            let post_res_data = '';
            res2.on('data', (c) => post_res_data += c);
            res2.on('end', () => {
                let selects = post_res_data.match(/<select[^>]+>([\s\S]*?)<\/select>/g) || [];
                console.log('\n--- PROGRAMS AFTER POSTBACK ---');
                selects.forEach(s => {
                    let name = s.match(/name="([^"]+)"/);
                    if (name && name[1].includes('programdl')) {
                        let opts = s.match(/<option[^>]*>([\s\S]*?)<\/option>/g) || [];
                        opts.forEach(opt => {
                            let val = opt.match(/value="([^"]*)"/);
                            let text = opt.replace(/<[^>]+>/g, '').trim();
                            if (text.includes('คอมพิวเตอร์') || text.includes('Computer')) {
                                console.log(`Program Option: Value="${val ? val[1] : ''}" | Text="${text}"`);
                            }
                        });
                    }
                });
            });
        });
        req.write(postData);
        req.end();
    });
});
