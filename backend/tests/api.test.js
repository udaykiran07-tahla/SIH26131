const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const env = require('../src/config/env');

beforeAll(async () => {
  await mongoose.connect(env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Crop Intelligence Backend API Test Suite', () => {
  test('1. Health Check Endpoint returns 200 online', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('online');
  });

  test('2. GET /api/crops returns seeded Indian crops', async () => {
    const res = await request(app).get('/api/crops');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const tomato = res.body.data.find((c) => c.name === 'Tomato');
    expect(tomato).toBeDefined();
  });

  test('3. GET /api/conditions returns conditions with ICAR references', async () => {
    const res = await request(app).get('/api/conditions');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const earlyBlight = res.body.data.find((c) => c.name === 'Tomato Early Blight');
    expect(earlyBlight).toBeDefined();
    expect(earlyBlight.references.length).toBeGreaterThan(0);
  });

  test('4. GET /api/dashboard/stats returns dynamic metrics', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics).toBeDefined();
    expect(res.body.data.metrics.totalCrops).toBeGreaterThan(0);
    expect(res.body.data.metrics.totalConditions).toBeGreaterThan(0);
  });

  test('5. POST /api/admin/login authenticates default admin user', async () => {
    const res = await request(app).post('/api/admin/login').send({
      username: 'admin',
      password: 'admin123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  test('6. POST /api/predictions requires an image file', async () => {
    const res = await request(app).post('/api/predictions');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
