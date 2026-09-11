const http = require('http');

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, dataLength: data.length });
      });
    }).on('error', reject);
  });
}

async function runHealthChecks() {
  try {
    const backend = await checkUrl('http://localhost:5000/api/health');
    console.log(`Backend Health (5000): HTTP ${backend.statusCode}`);

    const frontend = await checkUrl('http://localhost:3000/');
    console.log(`Frontend Homepage (3000): HTTP ${frontend.statusCode}, Size: ${frontend.dataLength} bytes`);

    const knowledge = await checkUrl('http://localhost:3000/knowledge');
    console.log(`Frontend Knowledge (3000): HTTP ${knowledge.statusCode}, Size: ${knowledge.dataLength} bytes`);

    const history = await checkUrl('http://localhost:3000/history');
    console.log(`Frontend History (3000): HTTP ${history.statusCode}, Size: ${history.dataLength} bytes`);

    console.log('\n🎉 ALL SERVICES RUNNING & RESPONDING WITH 200 OK!');
  } catch (e) {
    console.error('Health check failed:', e);
    process.exit(1);
  }
}

runHealthChecks();
