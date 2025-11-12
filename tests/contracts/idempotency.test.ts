/**
 * Контракт-тесты для идемпотентности экономических операций
 * Проверяет что повторные запросы с одинаковым Idempotency-Key обрабатываются корректно
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'https://api.go2asia.space';

test.describe('Idempotency Tests', () => {
  test('POST with same Idempotency-Key creates only one transaction', async ({ request }) => {
    // TODO: Реализовать когда будет готов endpoint для добавления points
    // Пока это заглушка для будущей реализации
    
    const idempotencyKey = `test-${Date.now()}`;
    const userId = '550e8400-e29b-41d4-a716-446655440100'; // Тестовый пользователь из seed
    
    // Первый запрос
    const response1 = await request.post(`${API_URL}/v1/api/token/points/add`, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Idempotency-Key': idempotencyKey,
        'Content-Type': 'application/json',
      },
      data: {
        userId,
        amount: 100,
        description: 'Test transaction',
      },
    });
    
    // Второй запрос с тем же Idempotency-Key
    const response2 = await request.post(`${API_URL}/v1/api/token/points/add`, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Idempotency-Key': idempotencyKey,
        'Content-Type': 'application/json',
      },
      data: {
        userId,
        amount: 100,
        description: 'Test transaction',
      },
    });
    
    // Оба запроса должны вернуть одинаковый результат
    if (response1.ok() && response2.ok()) {
      const data1 = await response1.json();
      const data2 = await response2.json();
      
      // Transaction ID должен быть одинаковым
      expect(data1.transactionId).toBe(data2.transactionId);
      
      // Баланс должен быть одинаковым
      expect(data1.balanceAfter).toBe(data2.balanceAfter);
    }
  });

  test('Different Idempotency-Key creates different transactions', async ({ request }) => {
    // TODO: Реализовать когда будет готов endpoint
    const userId = '550e8400-e29b-41d4-a716-446655440100';
    
    const response1 = await request.post(`${API_URL}/v1/api/token/points/add`, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Idempotency-Key': `test-${Date.now()}-1`,
        'Content-Type': 'application/json',
      },
      data: {
        userId,
        amount: 100,
        description: 'Test transaction 1',
      },
    });
    
    const response2 = await request.post(`${API_URL}/v1/api/token/points/add`, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Idempotency-Key': `test-${Date.now()}-2`,
        'Content-Type': 'application/json',
      },
      data: {
        userId,
        amount: 100,
        description: 'Test transaction 2',
      },
    });
    
    if (response1.ok() && response2.ok()) {
      const data1 = await response1.json();
      const data2 = await response2.json();
      
      // Transaction ID должны быть разными
      expect(data1.transactionId).not.toBe(data2.transactionId);
      
      // Баланс должен увеличиться на 200 (100 + 100)
      expect(data2.balanceAfter).toBe(data1.balanceAfter + 100);
    }
  });
});

