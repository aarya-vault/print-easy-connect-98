
-- Updated PrintEasy Database Schema with Authentication Support

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_files CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shop_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS shops CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS uploaded_files_seq CASCADE;
DROP SEQUENCE IF EXISTS walk_in_seq CASCADE;

-- Users table (unified for customers, shop owners, and admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255), -- For shop owners and admins
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'shop_owner', 'admin')),
    is_active BOOLEAN DEFAULT true,
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
    email VARCHAR(255) NOT NULL,
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '18:00:00',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table with improved structure
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
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sequences for order ID generation
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
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order status history table
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50) NOT NULL, -- 'customer', 'shop_owner', 'admin'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
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

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_shops_owner_id ON shops(owner_id);
CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_active ON shops(is_active);
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_urgent ON orders(is_urgent);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_order_files_order_id ON order_files(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_shop_id ON notifications(shop_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@printeasy.com', '$2b$10$rQZ8JVmAYvnmK5U5mF5Xre6xMvY1NgwL7jP8F9ZqH3KWmN2XvQlXO', 'PrintEasy Admin', 'admin');

-- Insert sample shop owner (password: password)
INSERT INTO users (email, password_hash, name, role) VALUES 
('shop@example.com', '$2b$10$8O2yRz6VHWA3zJ1F7mK9KOK8U3fF5B4D2LZ9Q6X1V8W7S5H2P1N0M', 'Shop Owner', 'shop_owner');

-- Insert sample shop
INSERT INTO shops (owner_id, name, slug, address, phone, email) VALUES 
(2, 'Quick Print Solutions', 'quick-print-solutions', 'Shop 12, MG Road, Bangalore, Karnataka 560001', '+91 98765 43210', 'shop@example.com');

-- Insert sample customer
INSERT INTO users (phone, name, role) VALUES 
('9876543210', 'Rajesh Kumar', 'customer');

-- Insert sample orders
INSERT INTO orders (shop_id, customer_id, order_type, description, status, is_urgent, services, pages, copies, color) VALUES 
(1, 3, 'uploaded-files', 'Business presentation slides - 50 pages, color printing, spiral binding', 'processing', true, '["Color Printing", "Spiral Binding"]', 50, 1, true),
(1, 3, 'walk-in', 'College textbook scanning - 200 pages', 'confirmed', false, '["Scanning"]', 200, 1, false);
