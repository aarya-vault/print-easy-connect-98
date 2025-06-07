
-- PrintEasy Complete Database Schema with File Upload and Chat Support

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (consolidated for all user types)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'shop_owner', 'admin')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shops table
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '18:00:00',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    offline_module_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(10) PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('walk-in', 'uploaded-files')),
    description TEXT NOT NULL,
    instructions TEXT,
    services JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled')),
    is_urgent BOOLEAN DEFAULT false,
    pages INTEGER,
    copies INTEGER DEFAULT 1,
    paper_type VARCHAR(100),
    binding VARCHAR(100),
    color BOOLEAN DEFAULT false,
    estimated_completion TIMESTAMP,
    actual_completion TIMESTAMP,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sequences for order IDs
CREATE SEQUENCE uploaded_files_seq START 1;
CREATE SEQUENCE walk_in_seq START 1;

-- Function to generate order IDs
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_type = 'uploaded-files' THEN
        NEW.id := 'UF' || LPAD(nextval('uploaded_files_seq')::text, 3, '0');
    ELSE
        NEW.id := 'WI' || LPAD(nextval('walk_in_seq')::text, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order IDs
CREATE TRIGGER generate_order_id_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_id();

-- Order files table
CREATE TABLE order_files (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order status history table
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(20) NOT NULL,
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop settings table
CREATE TABLE shop_settings (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shop_id, setting_key)
);

-- User sessions table for enhanced security
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_urgent ON orders(is_urgent);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_order_files_order_id ON order_files(order_id);
CREATE INDEX idx_chat_messages_order_id ON chat_messages(order_id);
CREATE INDEX idx_chat_messages_recipient ON chat_messages(recipient_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_shops_owner_id ON shops(owner_id);
CREATE INDEX idx_shops_slug ON shops(slug);

-- Insert sample data
INSERT INTO users (phone, email, name, role, password_hash) VALUES
('9876543210', 'shop@printeasy.com', 'Shop Owner', 'shop_owner', '$2b$10$example.hash.for.password'),
('9876543211', 'admin@printeasy.com', 'Admin User', 'admin', '$2b$10$example.hash.for.password'),
('9876543212', NULL, 'Test Customer', 'customer', NULL);

INSERT INTO shops (owner_id, name, slug, address, phone, email) VALUES
(1, 'Quick Print Solutions', 'quick-print-solutions', 'Shop 12, MG Road, Bangalore, Karnataka 560001', '+91 98765 43210', 'shop@printeasy.com');

-- Insert sample orders
INSERT INTO orders (shop_id, customer_id, order_type, description, status, is_urgent, services, pages, copies, color)
VALUES 
(1, 3, 'uploaded-files', 'Business presentation slides - 50 pages, color printing, spiral binding', 'processing', true, '["Color Printing", "Spiral Binding"]', 50, 1, true),
(1, 3, 'uploaded-files', 'Resume printing - 10 copies, premium paper', 'new', true, '["Black & White Printing"]', 2, 10, false),
(1, 3, 'walk-in', 'College textbook scanning - 200 pages', 'confirmed', false, '["Scanning"]', 200, 1, false);
