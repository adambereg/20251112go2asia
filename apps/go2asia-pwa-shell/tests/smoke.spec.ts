/**
 * Smoke tests for Go2Asia PWA
 * Basic health checks and critical paths
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Go2Asia/i);
  });

  test('health check works', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'https://api.go2asia.space';
    const response = await request.get(`${apiUrl}/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  test('ready check works', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'https://api.go2asia.space';
    const response = await request.get(`${apiUrl}/ready`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });

  test('API Gateway root endpoint', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'https://api.go2asia.space';
    const response = await request.get(`${apiUrl}/`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
});

