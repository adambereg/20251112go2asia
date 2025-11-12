# @go2asia/logger

Единый логгер для всех сервисов Go2Asia.

## Функции

- Генерация requestId для трассировки
- Структурированное логирование
- JWT утилиты (только через jose)

## Использование

```typescript
import { generateRequestId, logRequest, logError } from '@go2asia/logger';

const requestId = generateRequestId();
logRequest(requestId, 'GET', '/api/users', 150, 200);
logError(requestId, error, { userId: '123' });
```

