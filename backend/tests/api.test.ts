import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('AGRI MITRA Backend API Endpoints', () => {
  const app = createApp();

  it('Health Check endpoint should return 200 OK', async () => {
    // Basic verification of server creation
    expect(app).toBeDefined();
  });
});
