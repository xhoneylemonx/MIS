const net = require('net');

console.log("Testing connection to localhost:5432...");
const client = net.createConnection({ port: 5432, host: 'localhost' }, () => {
    console.log('Connected to PostgreSQL successfully!');
    client.end();
    process.exit(0);
});

client.on('error', (err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
});

setTimeout(() => {
    console.error('Connection timed out! Port 5432 is not responding.');
    client.end();
    process.exit(1);
}, 2000);
