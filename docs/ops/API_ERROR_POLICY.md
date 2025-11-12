# Политика ошибок API

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Единый формат ответа об ошибке

Все ошибки API должны возвращаться в едином формате `ErrorResponse`:

```typescript
interface ErrorResponse {
  error: {
    code: string;        // Код ошибки (см. матрицу кодов)
    message: string;     // Сообщение об ошибке
    key?: string;        // Ключ поля с ошибкой (для валидации)
    traceId: string;     // ID запроса для трейсинга (UUID)
  };
}
```

### Примеры

**Валидация:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "key": "limit",
    "traceId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**Не найдено:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Country with id '123' not found",
    "traceId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**Внутренняя ошибка:**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An internal error occurred",
    "traceId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

---

## Матрица HTTP кодов и кодов ошибок

| HTTP Code | Код ошибки | Описание | Когда использовать |
|-----------|------------|----------|-------------------|
| **400** | `VALIDATION_ERROR` | Неверные параметры запроса | Некорректные данные в запросе |
| **400** | `BAD_REQUEST` | Некорректный запрос | Общая ошибка клиента |
| **401** | `UNAUTHORIZED` | Требуется авторизация | Отсутствует или невалидный JWT |
| **403** | `FORBIDDEN` | Доступ запрещён | Недостаточно прав |
| **404** | `NOT_FOUND` | Ресурс не найден | Запрашиваемый ресурс отсутствует |
| **409** | `CONFLICT` | Конфликт | Дубликат, конфликт состояния |
| **429** | `RATE_LIMIT_EXCEEDED` | Превышен лимит запросов | Rate limiting сработал |
| **500** | `INTERNAL_ERROR` | Внутренняя ошибка сервера | Неожиданная ошибка |
| **503** | `SERVICE_UNAVAILABLE` | Сервис недоступен | БД недоступна, внешний сервис не отвечает |

---

## Реализация в Gateway

```typescript
// services/api-gateway/src/middleware/errorHandler.ts
import { Context } from 'hono';

export function createErrorResponse(
  code: string,
  message: string,
  traceId: string,
  key?: string,
  statusCode: number = 500
) {
  return {
    error: {
      code,
      message,
      traceId,
      ...(key && { key }),
    },
  };
}

export function errorHandler(c: Context, error: Error, traceId: string) {
  // Определить код ошибки по типу
  let code = 'INTERNAL_ERROR';
  let statusCode = 500;
  
  if (error.name === 'ValidationError') {
    code = 'VALIDATION_ERROR';
    statusCode = 400;
  } else if (error.name === 'NotFoundError') {
    code = 'NOT_FOUND';
    statusCode = 404;
  } else if (error.name === 'UnauthorizedError') {
    code = 'UNAUTHORIZED';
    statusCode = 401;
  } else if (error.name === 'ForbiddenError') {
    code = 'FORBIDDEN';
    statusCode = 403;
  }
  
  return c.json(
    createErrorResponse(code, error.message, traceId),
    statusCode
  );
}
```

---

## Пагинация

### Cursor-based пагинация (рекомендуется)

**Формат запроса:**
```
GET /v1/api/content/countries?limit=20&cursor=eyJpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCJ9
```

**Формат ответа:**
```json
{
  "items": [...],
  "nextCursor": "eyJpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCJ9",
  "hasMore": true
}
```

**Параметры:**
- `limit` (optional): количество элементов (1-100, по умолчанию 20)
- `cursor` (optional): курсор для следующей страницы (base64 encoded JSON)

**Реализация:**
```typescript
// packages/common-db/src/utils/pagination.ts
export function encodeCursor(data: object): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeCursor(cursor: string): object {
  return JSON.parse(Buffer.from(cursor, 'base64').toString());
}

export async function executeCursorPagination<T>(
  query: QueryBuilder,
  limit: number = 20,
  cursor?: string
): Promise<{ items: T[]; nextCursor: string | null; hasMore: boolean }> {
  const decodedCursor = cursor ? decodeCursor(cursor) : null;
  
  // Применить курсор к запросу
  if (decodedCursor) {
    query.where('id', '>', decodedCursor.id);
  }
  
  const items = await query.limit(limit + 1).execute();
  const hasMore = items.length > limit;
  
  if (hasMore) {
    items.pop(); // Удалить лишний элемент
  }
  
  const nextCursor = hasMore && items.length > 0
    ? encodeCursor({ id: items[items.length - 1].id })
    : null;
  
  return { items, nextCursor, hasMore };
}
```

### Offset-based пагинация (альтернатива)

Если нужна offset-based пагинация:

**Формат запроса:**
```
GET /v1/api/content/countries?limit=20&offset=0
```

**Формат ответа:**
```json
{
  "items": [...],
  "total": 150,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

**Параметры:**
- `limit` (optional): количество элементов (1-100, по умолчанию 20)
- `offset` (optional): смещение (по умолчанию 0)

---

## Валидация в Gateway

```typescript
// services/api-gateway/src/middleware/validation.ts
import { z } from 'zod';
import { Context } from 'hono';

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  c: Context,
  traceId: string
): T | null {
  try {
    const body = c.req.valid('json');
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      c.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          firstError.message,
          traceId,
          firstError.path.join('.')
        ),
        400
      );
      return null;
    }
    throw error;
  }
}
```

---

## Логирование ошибок

Все ошибки должны логироваться с traceId:

```typescript
logger.error('API Error', {
  traceId,
  code,
  message,
  path: c.req.path,
  method: c.req.method,
  error: error.stack,
});
```

---

## OpenAPI спецификация

Все коды ошибок должны быть описаны в OpenAPI спецификациях (см. `docs/templates/openapi-content-example.yaml`).

---

**Последнее обновление:** 2025-11-09

