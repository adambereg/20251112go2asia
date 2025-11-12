-- Seed данные для мест (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO places (id, city_id, name, slug, type, description, address, coordinates, metadata, is_russian_friendly, created_at, updated_at)
VALUES 
  -- Хошимин
  (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    'Нотр-Дам де Сайгон',
    'notre-dame-saigon',
    'attraction',
    'Католическая базилика в центре Хошимина',
    '1 Công xã Paris, Bến Nghé, Quận 1',
    '{"lat": 10.7797, "lng": 106.6991}'::jsonb,
    '{"hours": "08:00-17:00", "phone": "+84 28 3822 0477"}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    'Ресторан Russian House',
    'russian-house-saigon',
    'restaurant',
    'Русская кухня в Хошимине',
    '123 Nguyễn Huệ, Quận 1',
    '{"lat": 10.7756, "lng": 106.7019}'::jsonb,
    '{"hours": "11:00-23:00", "phone": "+84 28 3823 4567", "cuisine": "Russian"}'::jsonb,
    true,
    NOW(),
    NOW()
  ),
  -- Ханой
  (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440002',
    'Ханойская цитадель',
    'hanoi-citadel',
    'attraction',
    'Историческая крепость в центре Ханоя',
    'Hoàng Diệu, Điện Bàn, Ba Đình',
    '{"lat": 21.0333, "lng": 105.8406}'::jsonb,
    '{"hours": "08:00-17:00"}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  -- Дананг
  (
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440003',
    'Мраморные горы',
    'marble-mountains',
    'attraction',
    'Группа из пяти холмов из мрамора и известняка',
    'Hòa Hải, Ngũ Hành Sơn',
    '{"lat": 16.0000, "lng": 108.2500}'::jsonb,
    '{"hours": "07:00-17:30"}'::jsonb,
    false,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

