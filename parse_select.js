const fs = require('fs');
const html = fs.readFileSync('reg.html', 'utf8');

const cheer = html.split('<select');
let matchCount = 0;

for (let i = 1; i < cheer.length; i++) {
    const chunk = cheer[i].split('</select>')[0];
    const nameMatch = chunk.match(/name="([^"]+)"/i);
    if (!nameMatch) continue;

    console.log('\n--- Select:', nameMatch[1], '---');

    const options = [...chunk.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]+)<\/option>/gi)];
    console.log('Options Count:', options.length);
    if (options.length) {
        console.log('Sample Options:');
        options.slice(0, 5).forEach(o => {
            console.log(`  - Value: "${o[1]}", Text: "${o[2].trim()}"`);
        });
    }
}
