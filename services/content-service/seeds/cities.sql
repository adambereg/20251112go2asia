-- Seed данные для городов (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO cities (id, country_id, name, slug, description, metadata, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Хошимин',
    'ho-chi-minh',
    'Крупнейший город Вьетнама',
    '{"population": 9000000, "coordinates": {"lat": 10.8231, "lng": 106.6297}}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ханой',
    'hanoi',
    'Столица Вьетнама',
    '{"population": 8000000, "coordinates": {"lat": 21.0285, "lng": 105.8542}}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'Дананг',
    'da-nang',
    'Курортный город на побережье',
    '{"population": 1200000, "coordinates": {"lat": 16.0544, "lng": 108.2022}}'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

