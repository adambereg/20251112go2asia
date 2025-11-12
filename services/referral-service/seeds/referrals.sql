-- Seed данные для рефералов (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

-- Тестовый пользователь-реферер
INSERT INTO referral_stats (id, user_id, total_referrals, active_referrals, total_earned, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440300',
    '550e8400-e29b-41d4-a716-446655440100',
    2,
    2,
    1000,
    NOW(),
    NOW()
  )
ON CONFLICT (user_id) DO NOTHING;

-- Реферальные связи
INSERT INTO referrals (id, referrer_id, referred_id, status, registered_at, activated_at, created_at, updated_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440310',
    '550e8400-e29b-41d4-a716-446655440100',
    '550e8400-e29b-41d4-a716-446655440101',
    'active',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440311',
    '550e8400-e29b-41d4-a716-446655440100',
    '550e8400-e29b-41d4-a716-446655440102',
    'active',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (referred_id) DO NOTHING;

