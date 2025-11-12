/**
 * Контракт-тесты для заголовков ответов
 * Проверяет rate-limit и cache-control заголовки
 */

import { describe, test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'https://api.go2asia.space';

describe('Headers Contract Tests', () => {
  describe('Rate Limit Headers', () => {
    test('Public GET endpoints include rate limit headers on 200', async ({ request }) => {
      const response = await request.get(`${API_URL}/v1/api/content/countries`);
      
      expect(response.status()).toBe(200);
      
      const headers = response.headers();
      expect(headers['x-ratelimit-limit']).toBeDefined();
      expect(headers['x-ratelimit-remaining']).toBeDefined();
      expect(headers['x-ratelimit-reset']).toBeDefined();
      
      // Проверяем что значения реалистичные
      const limit = parseInt(headers['x-ratelimit-limit']!);
      expect(limit).toBeGreaterThan(0);
      
      const remaining = parseInt(headers['x-ratelimit-remaining']!);
      expect(remaining).toBeGreaterThanOrEqual(0);
      expect(remaining).toBeLessThanOrEqual(limit);
      
      // Reset должен быть валидной датой
      const resetDate = new Date(headers['x-ratelimit-reset']!);
      expect(resetDate.getTime()).toBeGreaterThan(Date.now());
    });

    test('Rate limit headers present on 429 response', async ({ request }) => {
      // Делаем много запросов чтобы получить 429
      const requests = Array(150).fill(null).map(() => 
        request.get(`${API_URL}/v1/api/content/countries`)
      );
      
      const responses = await Promise.all(requests);
      const rateLimited = responses.find(r => r.status() === 429);
      
      if (rateLimited) {
        const headers = rateLimited.headers();
        expect(headers['x-ratelimit-limit']).toBeDefined();
        expect(headers['x-ratelimit-remaining']).toBe('0');
        expect(headers['x-ratelimit-reset']).toBeDefined();
      }
    });
  });

  describe('Cache Control Headers', () => {
    test('Public GET endpoints have cache headers (moderate TTL)', async ({ request }) => {
      const response = await request.get(`${API_URL}/v1/api/content/countries`);
      
      expect(response.status()).toBe(200);
      
      const cacheControl = response.headers()['cache-control'];
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('s-maxage=300');
      expect(cacheControl).toContain('stale-while-revalidate=60');
      
      const vary = response.headers()['vary'];
      expect(vary).toContain('Accept');
    });

    test('Events endpoints have dynamic cache headers (short TTL)', async ({ request }) => {
      const response = await request.get(`${API_URL}/v1/api/content/events`);
      
      if (response.status() === 200) {
        const cacheControl = response.headers()['cache-control'];
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('s-maxage=120');
        expect(cacheControl).toContain('stale-while-revalidate=30');
      }
    });

    test('Articles endpoints have stable cache headers (long TTL)', async ({ request }) => {
      const response = await request.get(`${API_URL}/v1/api/content/articles`);
      
      if (response.status() === 200) {
        const cacheControl = response.headers()['cache-control'];
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('s-maxage=600');
        expect(cacheControl).toContain('stale-while-revalidate=120');
      }
    });

    test('Private endpoints have no-store', async ({ request }) => {
      // Проверяем приватные endpoints (без авторизации получим 401, но заголовки должны быть)
      const response = await request.get(`${API_URL}/v1/api/token/balance`);
      
      const cacheControl = response.headers()['cache-control'];
      expect(cacheControl).toContain('no-store');
      expect(cacheControl).toContain('no-cache');
      expect(cacheControl).toContain('must-revalidate');
      
      expect(response.headers()['pragma']).toBe('no-cache');
      expect(response.headers()['expires']).toBe('0');
    });
  });

  describe('X-Version Header', () => {
    test('All responses include X-Version header', async ({ request }) => {
      const response = await request.get(`${API_URL}/health`);
      
      const version = response.headers()['x-version'];
      expect(version).toBeDefined();
      expect(version?.length).toBe(7); // Короткий SHA
    });
  });
});

