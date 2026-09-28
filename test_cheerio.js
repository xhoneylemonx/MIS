const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('printout.html', 'utf8');
const $ = cheerio.load(html);
const list = [];
$('table').each((i, table) => {
    $(table).find('tr').each((j, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 4) {
            const studentId = $(tds[1]).text().trim();
            const name = $(tds[2]).text().trim();
            if (studentId.length === 10 && !isNaN(studentId)) { // basic check for Maejo student id
                list.push({ studentId, name });
            }
        }
    });
});
console.log('Students parsed:', list.length);
if (list.length > 0) {
    console.log(list.slice(0, 5));
}
