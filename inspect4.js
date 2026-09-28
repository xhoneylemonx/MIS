const fs = require('fs');
const html = fs.readFileSync('reg_result.html', 'utf8');
console.log('Length:', html.length);
console.log('Has table?', html.includes('table'));
console.log('Error/Warning?', html.match(/<span[^>]*class="(?:err|warn|alert|text-danger)[^>]*>([\s\S]*?)<\/span>/gi) || 'None');
const allTables = html.match(/<table[^>]*>/gi);
console.log('Tables:', allTables);

const grid = html.match(/(<table[^>]*id="[^"]*grid[^"]*"[^>]*>[\s\S]*?<\/table>)/i);
if (grid) {
    console.log('Found grid table!');
}

const noData = html.match(/ไม่พบข้อมูล/);
if (noData) {
    console.log('Found "No Data" text (ไม่พบข้อมูล)');
}
