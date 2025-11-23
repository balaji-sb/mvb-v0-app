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

-- Added comprehensive RLS policies for all operations
-- Anyone can read admin user data (for authentication)
CREATE POLICY admin_v1_users_select_policy ON admin_v1_users
  FOR SELECT
  USING (true);

-- Allow INSERT when table is empty (first admin) or via service role
CREATE POLICY admin_v1_users_insert_policy ON admin_v1_users
  FOR INSERT
  WITH CHECK (
    (SELECT COUNT(*) FROM admin_v1_users) = 0 OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Allow UPDATE only via service role
CREATE POLICY admin_v1_users_update_policy ON admin_v1_users
  FOR UPDATE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Allow DELETE only via service role
CREATE POLICY admin_v1_users_delete_policy ON admin_v1_users
  FOR DELETE
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
