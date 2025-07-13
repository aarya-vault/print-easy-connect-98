-- PrintEasy Complete Database Schema
-- Optimized and production-ready schema for the PrintEasy platform

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_files CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shop_applications CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('customer', 'shop_owner', 'admin');
CREATE TYPE order_status AS ENUM ('new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled');
CREATE TYPE order_type AS ENUM ('upload', 'walkin');
CREATE TYPE paper_type AS ENUM ('A4', 'A3', 'Letter', 'Legal', 'Custom');
CREATE TYPE color_type AS ENUM ('black_white', 'color');
CREATE TYPE binding_type AS ENUM ('none', 'spiral', 'staple', 'perfect', 'hardcover');

-- ============= USERS TABLE =============
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(10) UNIQUE, -- For customers
    email VARCHAR(255) UNIQUE, -- For shop owners and admins
    password_hash VARCHAR(255), -- For shop owners and admins
    name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============= SHOPS TABLE =============
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Business details
    business_license VARCHAR(255),
    gst_number VARCHAR(20),
    
    -- Services offered
    services JSONB DEFAULT '[]'::jsonb,
    
    -- Operating hours
    operating_hours JSONB DEFAULT '{}'::jsonb,
    
    -- Settings
    settings JSONB DEFAULT '{
        "offline_module_enabled": true,
        "auto_accept_orders": false,
        "max_daily_orders": 100,
        "notification_preferences": {
            "email": true,
            "sms": false
        }
    }'::jsonb,
    
    -- Admin review
    admin_notes TEXT,
    admin_reviewed_by INTEGER REFERENCES users(id),
    admin_reviewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for shops table
CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_owner_id ON shops(owner_id);
CREATE INDEX idx_shops_is_approved ON shops(is_approved);
CREATE INDEX idx_shops_is_active ON shops(is_active);
CREATE INDEX idx_shops_location ON shops(latitude, longitude);
CREATE INDEX idx_shops_created_at ON shops(created_at);

-- ============= SHOP APPLICATIONS TABLE =============
CREATE TABLE shop_applications (
    id SERIAL PRIMARY KEY,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(15) NOT NULL,
    
    -- Shop details
    shop_name VARCHAR(255) NOT NULL,
    shop_address TEXT NOT NULL,
    shop_city VARCHAR(100) NOT NULL,
    shop_state VARCHAR(100) NOT NULL,
    shop_postal_code VARCHAR(10),
    
    -- Business details
    business_type VARCHAR(100),
    business_license VARCHAR(255),
    gst_number VARCHAR(20),
    years_in_business INTEGER,
    
    -- Equipment and services
    equipment_details TEXT,
    services_offered JSONB DEFAULT '[]'::jsonb,
    daily_capacity INTEGER,
    
    -- Operating details
    operating_hours JSONB DEFAULT '{}'::jsonb,
    staff_count INTEGER,
    
    -- Documents
    documents JSONB DEFAULT '[]'::jsonb,
    
    -- Application status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    admin_notes TEXT,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for shop applications
CREATE INDEX idx_shop_applications_status ON shop_applications(status);
CREATE INDEX idx_shop_applications_created_at ON shop_applications(created_at);

-- ============= ORDERS TABLE =============
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    
    -- Related entities
    shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Customer details (stored for history even if user is deleted)
    customer_name VARCHAR(255),
    customer_phone VARCHAR(15),
    customer_email VARCHAR(255),
    
    -- Order details
    order_type order_type NOT NULL DEFAULT 'upload',
    status order_status DEFAULT 'new',
    description TEXT NOT NULL,
    instructions TEXT,
    
    -- Print specifications
    services JSONB DEFAULT '[]'::jsonb,
    pages INTEGER,
    copies INTEGER DEFAULT 1,
    paper_type paper_type DEFAULT 'A4',
    binding binding_type DEFAULT 'none',
    color color_type DEFAULT 'black_white',
    
    -- Pricing
    estimated_cost DECIMAL(10, 2),
    final_cost DECIMAL(10, 2),
    
    -- Flags
    is_urgent BOOLEAN DEFAULT false,
    is_paid BOOLEAN DEFAULT false,
    
    -- Timestamps
    estimated_completion TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for orders table
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_type ON orders(order_type);
CREATE INDEX idx_orders_is_urgent ON orders(is_urgent);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_updated_at ON orders(updated_at);

-- ============= ORDER FILES TABLE =============
CREATE TABLE order_files (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    checksum VARCHAR(64),
    upload_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for order files table
CREATE INDEX idx_order_files_order_id ON order_files(order_id);
CREATE INDEX idx_order_files_created_at ON order_files(created_at);

-- ============= ORDER STATUS HISTORY TABLE =============
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    notes TEXT,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for order status history
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_changed_at ON order_status_history(changed_at);

-- ============= TRIGGERS =============

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_applications_updated_at BEFORE UPDATE ON shop_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create status history on order status change
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, status, changed_at)
        VALUES (NEW.id, NEW.status, NOW());
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER order_status_change_trigger 
    AFTER UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION create_order_status_history();

-- ============= VIEWS =============

-- Active orders view for shops
CREATE VIEW shop_active_orders AS
SELECT 
    o.*,
    s.name as shop_name,
    COUNT(f.id) as file_count
FROM orders o
LEFT JOIN shops s ON o.shop_id = s.id
LEFT JOIN order_files f ON o.id = f.order_id
WHERE o.status NOT IN ('completed', 'cancelled')
GROUP BY o.id, s.name;

-- Customer order summary view
CREATE VIEW customer_order_summary AS
SELECT 
    o.*,
    s.name as shop_name,
    s.address as shop_address,
    COUNT(f.id) as file_count
FROM orders o
LEFT JOIN shops s ON o.shop_id = s.id
LEFT JOIN order_files f ON o.id = f.order_id
GROUP BY o.id, s.name, s.address;

-- ============= FUNCTIONS =============

-- Function to get shop stats
CREATE OR REPLACE FUNCTION get_shop_stats(shop_id_param INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', (SELECT COUNT(*) FROM orders WHERE shop_id = shop_id_param),
        'pending_orders', (SELECT COUNT(*) FROM orders WHERE shop_id = shop_id_param AND status IN ('new', 'confirmed', 'processing')),
        'completed_orders', (SELECT COUNT(*) FROM orders WHERE shop_id = shop_id_param AND status = 'completed'),
        'urgent_orders', (SELECT COUNT(*) FROM orders WHERE shop_id = shop_id_param AND is_urgent = true AND status NOT IN ('completed', 'cancelled')),
        'today_orders', (SELECT COUNT(*) FROM orders WHERE shop_id = shop_id_param AND DATE(created_at) = CURRENT_DATE)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get customer stats
CREATE OR REPLACE FUNCTION get_customer_stats(customer_id_param INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', (SELECT COUNT(*) FROM orders WHERE customer_id = customer_id_param),
        'completed_orders', (SELECT COUNT(*) FROM orders WHERE customer_id = customer_id_param AND status = 'completed'),
        'pending_orders', (SELECT COUNT(*) FROM orders WHERE customer_id = customer_id_param AND status IN ('new', 'confirmed', 'processing', 'ready')),
        'visited_shops', (SELECT COUNT(DISTINCT shop_id) FROM orders WHERE customer_id = customer_id_param)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============= INITIAL DATA =============

-- Insert initial admin user
INSERT INTO users (email, password_hash, name, role, is_active, email_verified) 
VALUES (
    'admin@printeasy.com', 
    '$2b$10$example.hash.here', -- This should be properly hashed
    'PrintEasy Admin', 
    'admin', 
    true, 
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample shop owner
INSERT INTO users (email, password_hash, name, phone, role, is_active, email_verified) 
VALUES (
    'shop@example.com',
    '$2b$10$example.hash.here', -- This should be properly hashed
    'Demo Shop Owner',
    '9876543210',
    'shop_owner',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample shop
INSERT INTO shops (
    name, slug, email, phone, address, city, state, 
    owner_id, is_approved, services, operating_hours
) 
SELECT 
    'Quick Print Shop',
    'quick-print-shop',
    'shop@example.com',
    '9876543210',
    '123 Main Street, City Center',
    'Mumbai',
    'Maharashtra',
    u.id,
    true,
    '["printing", "scanning", "binding", "lamination"]'::jsonb,
    '{
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "18:00"},
        "saturday": {"open": "10:00", "close": "16:00"},
        "sunday": {"closed": true}
    }'::jsonb
FROM users u 
WHERE u.email = 'shop@example.com' 
ON CONFLICT (slug) DO NOTHING;

-- ============= PERMISSIONS & SECURITY =============

-- Create role for application
CREATE ROLE printeasy_app;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO printeasy_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO printeasy_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO printeasy_app;

-- Comments for documentation
COMMENT ON TABLE users IS 'Users table storing customers, shop owners, and admins';
COMMENT ON TABLE shops IS 'Print shops registered on the platform';
COMMENT ON TABLE orders IS 'Orders placed by customers to shops';
COMMENT ON TABLE order_files IS 'Files uploaded for print orders';
COMMENT ON TABLE order_status_history IS 'Audit trail for order status changes';
COMMENT ON TABLE shop_applications IS 'Shop registration applications for admin review';

-- Analysis and optimization
ANALYZE users;
ANALYZE shops;
ANALYZE orders;
ANALYZE order_files;
ANALYZE order_status_history;
ANALYZE shop_applications;