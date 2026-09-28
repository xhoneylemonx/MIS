const fs = require('fs');
const html = fs.readFileSync('reg.html', 'utf8');

const buttons = html.match(/<input[^>]+type="(?:submit|button|image)"[^>]*>/gi);
console.log('Input Buttons:', buttons);

const buttonTags = html.match(/<button[^>]*>[\s\S]*?<\/button>/gi);
console.log('Button Tags:', buttonTags);

const links = html.match(/<a[^>]+__doPostBack[^>]*>[\s\S]*?<\/a>/gi);
console.log('Postback Links:', links);
