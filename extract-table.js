const fs = require('fs');
const data = fs.readFileSync('result_dump.html', 'utf8');

// find all tables
const tables = data.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
console.log(`Found ${tables.length} tables`);

tables.forEach((t, index) => {
    // only if it looks like it has rows
    if (t.includes('<tr')) {
        let rows = t.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        console.log(`\nTable ${index + 1} has ${rows.length} rows`);
        if (rows.length > 2) {
            // print first row text
            let header = rows[0].replace(/<[^>]+>/g, ',').replace(/\s+/g, ' ').trim();
            console.log(`Header: ${header}`);

            // print data row text
            let d1 = rows[1].replace(/<[^>]+>/g, ',').replace(/\s+/g, ' ').trim();
            console.log(`Row 1: ${d1}`);
        }
    }
});
