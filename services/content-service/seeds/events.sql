-- Seed данные для событий (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO events (id, city_id, place_id, title, slug, description, start_date, end_date, metadata, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440001',
    NULL,
    'Фестиваль уличной еды',
    'street-food-festival-hcmc',
    'Ежегодный фестиваль уличной еды в Хошимине',
    '2025-12-01T10:00:00Z',
    '2025-12-07T22:00:00Z',
    '{"price": "Free", "location": "Nguyễn Huệ Walking Street"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440002',
    NULL,
    'Концерт классической музыки',
    'classical-concert-hanoi',
    'Концерт вьетнамской классической музыки',
    '2025-11-20T19:00:00Z',
    '2025-11-20T21:00:00Z',
    '{"price": "200000 VND", "venue": "Hanoi Opera House"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440013',
    'Экскурсия по Мраморным горам',
    'marble-mountains-tour',
    'Групповая экскурсия с русскоязычным гидом',
    '2025-11-15T08:00:00Z',
    '2025-11-15T12:00:00Z',
    '{"price": "500000 VND", "guide": "Russian-speaking", "group_size": 10}'::jsonb,
    true,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440023',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440011',
    'Русский вечер в Russian House',
    'russian-evening-saigon',
    'Вечер русской кухни и музыки',
    '2025-11-25T18:00:00Z',
    '2025-11-25T23:00:00Z',
    '{"price": "300000 VND", "includes": "Dinner + Live Music"}'::jsonb,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

