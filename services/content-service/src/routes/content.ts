import { Hono } from 'hono';
import { db } from '../utils/db';
import { countries, cities, places, events, articles } from '../db/schema';
import { eq, and, gte, lte, desc, asc, gt } from 'drizzle-orm';

const contentRouter = new Hono();

/**
 * GET /v1/countries - Список стран
 */
contentRouter.get('/countries', async (c) => {
  const requestId = c.get('requestId') || 'unknown';
  
  try {
    const items = await db.select().from(countries).orderBy(asc(countries.name));
    
    return c.json({
      items,
      pagination: {
        hasMore: false,
        nextCursor: null,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch countries',
          traceId: requestId,
        },
      },
      500
    );
  }
});

/**
 * GET /v1/countries/:id - Детали страны
 */
contentRouter.get('/countries/:id', async (c) => {
  const requestId = c.get('requestId') || 'unknown';
  const id = c.req.param('id');
  
  try {
    const [country] = await db
      .select()
      .from(countries)
      .where(eq(countries.id, id))
      .limit(1);
    
    if (!country) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Country not found',
            traceId: requestId,
          },
        },
        404
      );
    }
    
    return c.json(country);
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch country',
          traceId: requestId,
        },
      },
      500
    );
  }
});

/**
 * GET /v1/cities - Список городов с фильтрацией и пагинацией
 */
contentRouter.get('/cities', async (c) => {
  const requestId = c.get('requestId') || 'unknown';
  
  try {
    const country = c.req.query('country');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const cursor = c.req.query('cursor');
    
    // Строим условия фильтрации
    const conditions = [];
    
    // Фильтр по стране (по коду или ID)
    if (country) {
      // Если это UUID, фильтруем по country_id
      if (country.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        conditions.push(eq(cities.countryId, country));
      } else {
        // Иначе ищем страну по коду и фильтруем по country_id
        const [countryRecord] = await db
          .select()
          .from(countries)
          .where(eq(countries.code, country.toUpperCase()))
          .limit(1);
        
        if (countryRecord) {
          conditions.push(eq(cities.countryId, countryRecord.id));
        }
      }
    }
    
    // Cursor-based пагинация (используем id для устойчивости)
    if (cursor) {
      conditions.push(gt(cities.id, cursor));
    }
    
    // Применяем условия
    let query = db.select().from(cities);
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions)) as any;
    }
    
    const items = await query.limit(limit + 1).orderBy(asc(cities.id));
    
    const hasMore = items.length > limit;
    const resultItems = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && resultItems.length > 0 
      ? resultItems[resultItems.length - 1].id 
      : null;
    
    return c.json({
      items: resultItems,
      pagination: {
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch cities',
          traceId: requestId,
        },
      },
      500
    );
  }
});

/**
 * GET /v1/places - Список мест с фильтрацией и пагинацией
 */
contentRouter.get('/places', async (c) => {
  const requestId = c.get('requestId') || 'unknown';
  
  try {
    const city = c.req.query('city');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const cursor = c.req.query('cursor');
    
    // Строим условия фильтрации
    const conditions = [];
    
    // Фильтр по городу
    if (city) {
      conditions.push(eq(places.cityId, city));
    }
    
    // Cursor-based пагинация (используем id для устойчивости)
    if (cursor) {
      conditions.push(gt(places.id, cursor));
    }
    
    // Применяем условия
    let query = db.select().from(places);
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions)) as any;
    }
    
    const items = await query.limit(limit + 1).orderBy(asc(places.id));
    
    const hasMore = items.length > limit;
    const resultItems = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && resultItems.length > 0 
      ? resultItems[resultItems.length - 1].id 
      : null;
    
    return c.json({
      items: resultItems,
      pagination: {
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch places',
          traceId: requestId,
        },
      },
      500
    );
  }
});

export { contentRouter };

