import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../utils/db';
import { balances, transactions } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { createErrorResponse } from '../../../apps/api-gateway/src/utils/errors';

const pointsRouter = new Hono();

// Схема для добавления points
const addPointsSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  description: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

// Схема для вычитания points
const subtractPointsSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  description: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

/**
 * POST /points/add - Добавление points
 * Идемпотентный endpoint с проверкой Idempotency-Key
 */
pointsRouter.post('/add', async (c) => {
  const requestId = c.get('requestId') || 'unknown';
  const idempotencyKey = c.req.header('Idempotency-Key');
  
  try {
    const body = await c.req.json();
    const validated = addPointsSchema.parse(body);
    
    // Если передан idempotencyKey в заголовке, используем его
    const key = idempotencyKey || validated.idempotencyKey;
    
    if (key) {
      // Проверяем существующую транзакцию с таким ключом
      const existing = await db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, validated.userId),
            eq(transactions.idempotencyKey, key)
          )
        )
        .limit(1);
      
      if (existing.length > 0) {
        // Возвращаем существующую транзакцию
        return c.json({
          transactionId: existing[0].id,
          balanceAfter: existing[0].balanceAfter,
          message: 'Transaction already processed',
        });
      }
    }
    
    // Получаем текущий баланс
    const [balance] = await db
      .select()
      .from(balances)
      .where(eq(balances.userId, validated.userId))
      .limit(1);
    
    const balanceBefore = balance?.points || 0;
    const balanceAfter = balanceBefore + validated.amount;
    
    // Используем Drizzle транзакции для атомарности
    try {
      const result = await db.transaction(async (tx) => {
        if (!balance) {
          // Создаём баланс если его нет
          await tx
            .insert(balances)
            .values({
              userId: validated.userId,
              points: 0,
            });
        }
        
        // Создаём транзакцию
        const [transaction] = await tx
          .insert(transactions)
          .values({
            userId: validated.userId,
            idempotencyKey: key || null,
            type: 'earn',
            status: 'completed',
            amount: validated.amount,
            balanceBefore,
            balanceAfter,
            description: validated.description || 'Points added',
          })
          .returning();
        
        // Обновляем баланс
        await tx
          .update(balances)
          .set({ points: balanceAfter, updatedAt: new Date() })
          .where(eq(balances.userId, validated.userId));
        
        return transaction;
      });
      
      return c.json({
        transactionId: result.id,
        balanceBefore,
        balanceAfter,
      }, 201);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Invalid request parameters',
          requestId
        ),
        400
      );
    }
    
    return c.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'Failed to add points',
        requestId
      ),
      500
    );
  }
});

/**
 * POST /points/subtract - Вычитание points
 * Идемпотентный endpoint с проверкой Idempotency-Key
 */
pointsRouter.post('/subtract', async (c) => {
  const requestId = c.get('requestId') || 'unknown';
  const idempotencyKey = c.req.header('Idempotency-Key');
  
  try {
    const body = await c.req.json();
    const validated = subtractPointsSchema.parse(body);
    
    // Если передан idempotencyKey в заголовке, используем его
    const key = idempotencyKey || validated.idempotencyKey;
    
    if (key) {
      // Проверяем существующую транзакцию с таким ключом
      const existing = await db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, validated.userId),
            eq(transactions.idempotencyKey, key)
          )
        )
        .limit(1);
      
      if (existing.length > 0) {
        // Возвращаем существующую транзакцию
        return c.json({
          transactionId: existing[0].id,
          balanceAfter: existing[0].balanceAfter,
          message: 'Transaction already processed',
        });
      }
    }
    
    // Получаем текущий баланс
    const [balance] = await db
      .select()
      .from(balances)
      .where(eq(balances.userId, validated.userId))
      .limit(1);
    
    if (!balance) {
      return c.json(
        createErrorResponse(
          'INSUFFICIENT_BALANCE',
          'Balance not found',
          requestId
        ),
        404
      );
    }
    
    if (balance.points < validated.amount) {
      return c.json(
        createErrorResponse(
          'INSUFFICIENT_BALANCE',
          'Insufficient balance',
          requestId
        ),
        400
      );
    }
    
    const balanceBefore = balance.points;
    const balanceAfter = balanceBefore - validated.amount;
    
    // Используем Drizzle транзакции для атомарности
    try {
      const result = await db.transaction(async (tx) => {
        // Создаём транзакцию
        const [transaction] = await tx
          .insert(transactions)
          .values({
            userId: validated.userId,
            idempotencyKey: key || null,
            type: 'spend',
            status: 'completed',
            amount: -validated.amount,
            balanceBefore,
            balanceAfter,
            description: validated.description || 'Points subtracted',
          })
          .returning();
        
        // Обновляем баланс
        await tx
          .update(balances)
          .set({ points: balanceAfter, updatedAt: new Date() })
          .where(eq(balances.userId, validated.userId));
        
        return transaction;
      });
      
      return c.json({
        transactionId: result.id,
        balanceBefore,
        balanceAfter,
      }, 201);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Invalid request parameters',
          requestId
        ),
        400
      );
    }
    
    return c.json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'Failed to subtract points',
        requestId
      ),
      500
    );
  }
});

export { pointsRouter };

