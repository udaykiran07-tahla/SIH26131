const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const env = require('../src/config/env');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  await mongoose.connect(env.MONGODB_URI);
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) server.close();
  await mongoose.disconnect();
});

describe('API Smoke and Functional Tests', () => {
  test('1. GET /api/health returns online status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
  });

  test('2. GET /api/crops returns seeded crops with Tomato and Potato', async () => {
    const res = await fetch(`${baseUrl}/api/crops`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 5, 'Should have at least 5 seeded crops');
    const crops = json.data.map(c => c.name);
    assert.ok(crops.includes('Tomato'));
    assert.ok(crops.includes('Potato'));
    assert.ok(crops.includes('Rice'));
  });

  test('3. GET /api/conditions returns conditions with ICAR references', async () => {
    const res = await fetch(`${baseUrl}/api/conditions`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const earlyBlight = json.data.find(c => c.name === 'Tomato Early Blight');
    assert.ok(earlyBlight, 'Tomato Early Blight must exist in DB');
    assert.ok(earlyBlight.references.length > 0, 'Must have ICAR/KVK references');
    assert.ok(earlyBlight.management.chemical.disclaimer.includes('STATUTORY NOTICE'));
  });

  test('4. GET /api/dashboard/stats returns dynamic counts', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/stats`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.metrics.totalCrops > 0);
    assert.ok(json.data.metrics.totalConditions > 0);
    assert.ok(json.data.metrics.totalDatasetSamples > 0);
  });

  test('5. POST /api/admin/login succeeds with seeded admin credentials', async () => {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.token, 'Should return JWT token');
  });

  test('6. POST /api/predictions rejects empty requests with friendly farmer message', async () => {
    const res = await fetch(`${baseUrl}/api/predictions`, { method: 'POST' });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.message.includes('Please select or capture a photo'));
  });
});
