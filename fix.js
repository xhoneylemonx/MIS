const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}
const files = walk('src/app');
let replacedCount = 0;
files.forEach(f => {
    let data = fs.readFileSync(f, 'utf8');
    let original = data;
    data = data.replace(/\{[A-Za-z0-9_]+\.faculty\}[ \·]*/g, '');
    data = data.replace(/\{[A-Za-z0-9_]+\.program\}[ \·]*/g, '');
    if (data !== original) {
        fs.writeFileSync(f, data);
        replacedCount++;
    }
});
console.log('Replaced in ' + replacedCount + ' files');
