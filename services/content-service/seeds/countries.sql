-- Seed данные для стран (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO countries (id, name, slug, code, description, metadata, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Вьетнам',
    'vietnam',
    'VN',
    'Социалистическая Республика Вьетнам',
    '{"flag": "🇻🇳", "region": "Southeast Asia"}'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT (code) DO NOTHING;

