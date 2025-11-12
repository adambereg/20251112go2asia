-- Seed данные для статей (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO articles (id, author_id, city_id, title, slug, excerpt, content, published_at, metadata, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440100',
    '550e8400-e29b-41d4-a716-446655440001',
    'Первый раз во Вьетнаме: гид по Хошимину',
    'first-time-vietnam-ho-chi-minh-guide',
    'Всё что нужно знать для первого визита в Хошимин',
    'Хошимин — это город контрастов, где древние храмы соседствуют с небоскрёбами...',
    '2025-11-01T10:00:00Z',
    '{"tags": ["travel", "vietnam", "guide"], "category": "travel"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440100',
    '550e8400-e29b-41d4-a716-446655440002',
    'Русскоязычное сообщество в Ханое',
    'russian-community-hanoi',
    'Где найти русскоязычных экспатов в Ханое',
    'Ханой становится всё более популярным среди русскоязычных экспатов...',
    '2025-11-05T12:00:00Z',
    '{"tags": ["community", "expat", "hanoi"], "category": "lifestyle"}'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

