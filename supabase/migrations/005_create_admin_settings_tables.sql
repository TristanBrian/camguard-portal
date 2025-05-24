-- Table for general store settings
CREATE TABLE IF NOT EXISTS general_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  currency VARCHAR(10),
  language VARCHAR(50),
  time_zone VARCHAR(50),
  tax_rate NUMERIC(5,2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for notification settings
CREATE TABLE IF NOT EXISTS notification_settings (
  id SERIAL PRIMARY KEY,
  email_alerts BOOLEAN DEFAULT TRUE,
  order_notifications BOOLEAN DEFAULT TRUE,
  stock_alerts BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  security_alerts BOOLEAN DEFAULT TRUE,
  app_notifications BOOLEAN DEFAULT TRUE,
  promotion_alerts BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for security settings
CREATE TABLE IF NOT EXISTS security_settings (
  id SERIAL PRIMARY KEY,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for user profile
CREATE TABLE IF NOT EXISTS user_profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100),
  join_date DATE,
  last_login TIMESTAMP WITH TIME ZONE,
  avatar VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for backup settings
CREATE TABLE IF NOT EXISTS backup_settings (
  id SERIAL PRIMARY KEY,
  last_backup TIMESTAMP WITH TIME ZONE,
  auto_backup BOOLEAN DEFAULT TRUE,
  backup_frequency VARCHAR(20) DEFAULT 'weekly',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
