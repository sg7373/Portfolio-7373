const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const CSV_FILE = path.join(__dirname, 'messages.csv');

// Create CSV with headers if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, 'Date,Name,Email,Subject,Message\n');
}

const server = http.createServer((req, res) => {
    // Enable CORS for frontend interaction
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/send-message') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const timestamp = new Date().toLocaleString();

                // Clean data for CSV format (remove newlines, escape quotes)
                const clean = (str) => `"${(str || '').toString().replace(/"/g, '""').replace(/\n/g, ' ')}"`;

                const csvLine = `${timestamp},${clean(data.name)},${clean(data.email)},${clean(data.subject)},${clean(data.message)}\n`;

                fs.appendFile(CSV_FILE, csvLine, (err) => {
                    if (err) {
                        console.error('Error writing to CSV:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Database error' }));
                    } else {
                        console.log(`New message from ${data.name} saved to CSV.`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    }
                });
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(port, () => {
    console.log(`🚀 Contact Server is running!`);
    console.log(`📍 URL: http://localhost:${port}`);
    console.log(`📁 Saving messages to: ${CSV_FILE}`);
    console.log(`\nTo stop the server, press Ctrl+C`);
});
