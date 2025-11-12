-- Seed данные для транзакций (UTF-8)
-- Идемпотентные INSERT с ON CONFLICT DO NOTHING

INSERT INTO transactions (id, user_id, idempotency_key, type, status, amount, balance_before, balance_after, description, metadata, created_at)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440210',
    '550e8400-e29b-41d4-a716-446655440100',
    'seed-txn-001',
    'earn',
    'completed',
    500,
    0,
    500,
    'Welcome bonus',
    '{"source": "signup_bonus"}'::text,
    NOW() - INTERVAL '7 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440211',
    '550e8400-e29b-41d4-a716-446655440100',
    'seed-txn-002',
    'earn',
    'completed',
    300,
    500,
    800,
    'First check-in',
    '{"source": "checkin"}'::text,
    NOW() - INTERVAL '5 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440212',
    '550e8400-e29b-41d4-a716-446655440100',
    'seed-txn-003',
    'spend',
    'completed',
    -200,
    800,
    600,
    'Voucher purchase',
    '{"voucher_id": "voucher-123"}'::text,
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT DO NOTHING;

