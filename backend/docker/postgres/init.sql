-- docker/postgres/init.sql
-- Initial database setup script

-- Buat extension jika diperlukan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buat role tambahan jika diperlukan
-- CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';

-- Set timezone
SET TIME ZONE 'Asia/Jakarta';
