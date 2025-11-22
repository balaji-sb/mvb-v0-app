-- Create admin_v1_users table
CREATE TABLE IF NOT EXISTS admin_v1_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_v1_users_email ON admin_v1_users(email);

-- Enable RLS
ALTER TABLE admin_v1_users ENABLE ROW LEVEL SECURITY;

-- Admin users can only read their own data
CREATE POLICY admin_v1_users_select_policy ON admin_v1_users
  FOR SELECT
  USING (true);
