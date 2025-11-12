/**
 * Smoke тесты для staging окружения
 * Сквозные проверки с реальной БД
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'https://api-staging.go2asia.space';

test.describe('Staging Smoke Tests', () => {
  test('Health check works', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  test('Ready check works for services with DB', async ({ request }) => {
    // Content Service
    const contentReady = await request.get(`${API_URL.replace('api', 'content')}/ready`);
    expect(contentReady.ok()).toBeTruthy();
    
    const contentData = await contentReady.json();
    expect(contentData).toHaveProperty('status', 'ready');
  });

  test('GET /v1/countries returns list', async ({ request }) => {
    const response = await request.get(`${API_URL}/v1/api/content/countries`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
  });

  test('GET /v1/cities?country=VN returns cities with pagination', async ({ request }) => {
    const response = await request.get(`${API_URL}/v1/api/content/cities?country=VN`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    
    // Проверяем пагинацию
    if (data.items.length > 0) {
      expect(data).toHaveProperty('pagination');
      expect(data.pagination).toHaveProperty('hasMore');
      expect(data.pagination).toHaveProperty('nextCursor');
    }
  });

  test('GET /v1/places?city=<id> returns places with pagination', async ({ request }) => {
    // Сначала получаем список городов
    const citiesResponse = await request.get(`${API_URL}/v1/api/content/cities?country=VN`);
    const citiesData = await citiesResponse.json();
    
    if (citiesData.items && citiesData.items.length > 0) {
      const cityId = citiesData.items[0].id;
      
      const placesResponse = await request.get(`${API_URL}/v1/api/content/places?city=${cityId}`);
      expect(placesResponse.ok()).toBeTruthy();
      
      const placesData = await placesResponse.json();
      expect(placesData).toHaveProperty('items');
      expect(Array.isArray(placesData.items)).toBeTruthy();
      
      // Проверяем пагинацию
      expect(placesData).toHaveProperty('pagination');
      expect(placesData.pagination).toHaveProperty('hasMore');
      expect(placesData.pagination).toHaveProperty('nextCursor');
    }
  });

  test('Cursor pagination works correctly', async ({ request }) => {
    const firstPage = await request.get(`${API_URL}/v1/api/content/cities?country=VN&limit=2`);
    const firstPageData = await firstPage.json();
    
    if (firstPageData.pagination?.hasMore && firstPageData.pagination?.nextCursor) {
      const secondPage = await request.get(
        `${API_URL}/v1/api/content/cities?country=VN&limit=2&cursor=${firstPageData.pagination.nextCursor}`
      );
      const secondPageData = await secondPage.json();
      
      // Вторая страница должна содержать другие элементы
      expect(secondPageData.items.length).toBeGreaterThan(0);
      
      // ID не должны пересекаться
      const firstPageIds = firstPageData.items.map((item: any) => item.id);
      const secondPageIds = secondPageData.items.map((item: any) => item.id);
      const intersection = firstPageIds.filter((id: string) => secondPageIds.includes(id));
      expect(intersection.length).toBe(0);
    }
  });
});

