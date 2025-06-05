
-- Enhanced PrintEasy Shop Management Database Schema with Chat and Search Optimization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable trigram extension for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Shops table (existing)
CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '18:00:00',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table (existing)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(phone)
);

-- Orders table (enhanced with search optimization)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(10) PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create separate sequences for different order types
CREATE SEQUENCE IF NOT EXISTS uploaded_files_seq START 1;
CREATE SEQUENCE IF NOT EXISTS walk_in_seq START 1;

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
DROP TRIGGER IF EXISTS generate_order_id_trigger ON orders;
CREATE TRIGGER generate_order_id_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_id();

-- Order files table (existing)
CREATE TABLE IF NOT EXISTS order_files (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order status history table (existing)
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Chat messages table (NEW)
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    sender_id VARCHAR(50) NOT NULL, -- Could be customer phone or shop user ID
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'shop')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quick reply templates table (NEW)
CREATE TABLE IF NOT EXISTS quick_reply_templates (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'shop')),
    message_text TEXT NOT NULL,
    category VARCHAR(50), -- e.g., 'status_update', 'inquiry', 'confirmation'
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop settings table (existing)
CREATE TABLE IF NOT EXISTS shop_settings (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shop_id, setting_key)
);

-- Notifications table (existing)
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enhanced indexes for better performance and search
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_urgent ON orders(is_urgent);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_shop_id ON notifications(shop_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- NEW: Enhanced search indexes using trigrams for fuzzy search
CREATE INDEX IF NOT EXISTS idx_orders_customer_name_gin ON orders USING gin (customer_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone_gin ON orders USING gin (customer_phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_orders_id_gin ON orders USING gin (id gin_trgm_ops);

-- NEW: Chat-related indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_order_id ON chat_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_quick_replies_shop_sender ON quick_reply_templates(shop_id, sender_type);
CREATE INDEX IF NOT EXISTS idx_quick_replies_usage ON quick_reply_templates(usage_count DESC);

-- Insert sample shop (if not exists)
INSERT INTO shops (name, slug, address, phone, email, owner_name) 
SELECT 'Quick Print Solutions', 'quick-print-solutions', 'Shop 12, MG Road, Bangalore, Karnataka 560001', '+91 98765 43210', 'shop@printeasy.com', 'Shop Owner'
WHERE NOT EXISTS (SELECT 1 FROM shops WHERE slug = 'quick-print-solutions');

-- Insert sample quick reply templates
INSERT INTO quick_reply_templates (shop_id, sender_type, message_text, category) VALUES
(1, 'shop', 'Order confirmed! Will be ready in 30 minutes.', 'confirmation'),
(1, 'shop', 'Your order is ready for pickup!', 'status_update'),
(1, 'shop', 'There might be a slight delay due to high volume. Will update you shortly.', 'status_update'),
(1, 'shop', 'Please check the quality before leaving. Thank you!', 'completion'),
(1, 'customer', 'When will my order be ready?', 'inquiry'),
(1, 'customer', 'Any updates on my order?', 'inquiry'),
(1, 'customer', 'I need to modify my order', 'modification'),
(1, 'customer', 'I need to cancel my order', 'cancellation');

-- Insert sample orders (if table is empty)
INSERT INTO orders (shop_id, customer_name, customer_phone, customer_email, order_type, description, status, is_urgent, services, pages, copies, color)
SELECT * FROM (VALUES 
(1, 'Rajesh Kumar', '+91 98765 43210', 'rajesh@email.com', 'uploaded-files', 'Business presentation slides - 50 pages, color printing, spiral binding', 'processing', true, '["Color Printing", "Spiral Binding"]', 50, 1, true),
(1, 'Priya Sharma', '+91 87654 32109', 'priya@email.com', 'uploaded-files', 'Resume printing - 10 copies, premium paper', 'new', true, '["Black & White Printing"]', 2, 10, false),
(1, 'Amit Patel', '+91 76543 21098', 'amit@email.com', 'walk-in', 'College textbook scanning - 200 pages', 'confirmed', false, '["Scanning"]', 200, 1, false),
(1, 'Sneha Reddy', '+91 65432 10987', 'sneha@email.com', 'walk-in', 'Wedding invitation cards - 100 copies, premium cardstock', 'processing', false, '["Color Printing", "Premium Paper"]', 1, 100, true),
(1, 'Vikram Joshi', '+91 43210 98765', 'vikram@email.com', 'walk-in', 'Office documents photocopying - 50 pages', 'new', true, '["Photocopying"]', 50, 5, false)
) AS v(shop_id, customer_name, customer_phone, customer_email, order_type, description, status, is_urgent, services, pages, copies, color)
WHERE NOT EXISTS (SELECT 1 FROM orders);
