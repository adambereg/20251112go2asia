-- Seed данные для балансов (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO balances (id, user_id, points, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440200',
    '550e8400-e29b-41d4-a716-446655440100',
    1000,
    NOW(),
    NOW()
  )
ON CONFLICT (user_id) DO NOTHING;

