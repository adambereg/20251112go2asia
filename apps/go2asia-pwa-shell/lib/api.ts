/**
 * API клиент для работы с Go2Asia API
 * Использует сгенерированный SDK из @go2asia/sdk
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';

/**
 * Базовый fetch для SSR
 */
export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: {
      revalidate: 300, // 5 минут для публичных данных
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Получить список стран
 */
export async function getCountries() {
  return fetchAPI<{
    items: Array<{
      id: string;
      name: string;
      slug: string;
      code: string;
      description?: string;
    }>;
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
    };
  }>('/v1/api/content/countries');
}

/**
 * Получить детали страны
 */
export async function getCountry(id: string) {
  return fetchAPI<{
    id: string;
    name: string;
    slug: string;
    code: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }>(`/v1/api/content/countries/${id}`);
}

/**
 * Получить список городов
 */
export async function getCities(country?: string) {
  const params = country ? `?country=${country}` : '';
  return fetchAPI<{
    items: Array<{
      id: string;
      name: string;
      slug: string;
      countryId: string;
      description?: string;
    }>;
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
    };
  }>(`/v1/api/content/cities${params}`);
}

/**
 * Получить список статей
 */
export async function getArticles() {
  return fetchAPI<{
    items: Array<{
      id: string;
      title: string;
      slug: string;
      excerpt?: string;
      publishedAt: string;
    }>;
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
    };
  }>('/v1/api/content/articles');
}

/**
 * Получить детали статьи
 */
export async function getArticle(slug: string) {
  // Пока используем список и фильтруем по slug
  // В будущем будет отдельный endpoint
  const { items } = await getArticles();
  return items.find((article) => article.slug === slug);
}

/**
 * Получить список событий
 */
export async function getEvents() {
  return fetchAPI<{
    items: Array<{
      id: string;
      title: string;
      slug: string;
      description?: string;
      startDate: string;
      endDate?: string;
    }>;
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
    };
  }>('/v1/api/content/events');
}

