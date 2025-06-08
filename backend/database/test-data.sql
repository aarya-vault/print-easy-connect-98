
-- Test Data for PrintEasy Platform
-- This script creates test users for all roles and sample data

-- Insert test users with proper password hashing
INSERT INTO users (name, phone, email, password_hash, role, is_active, needs_name_update) VALUES
-- Customer test account
('Test Customer', '9876543210', NULL, NULL, 'customer', true, false),

-- Shop Owner test account  
('Test Shop Owner', '9876543211', 'shop@printeasy.com', '$2b$10$X9Y8Z7.abcdefghijklmnop', 'shop_owner', true, false),

-- Admin test account
('Test Admin', '9876543212', 'admin@printeasy.com', '$2b$10$A1B2C3.defghijklmnopqrs', 'admin', true, false);

-- Insert test shops
INSERT INTO shops (name, address, phone, email, rating, total_reviews, services, operating_hours, owner_id) VALUES
('Quick Print Solutions', '123 Connaught Place, New Delhi, 110001', '9876543211', 'shop@printeasy.com', 4.8, 156, 
 ARRAY['printing', 'binding', 'lamination', 'scanning'], 
 '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "10:00-16:00", "sunday": "closed"}'::jsonb,
 2),

('Digital Print Hub', '456 Karol Bagh, New Delhi, 110005', '9876543213', 'contact@digitalhub.com', 4.6, 89,
 ARRAY['printing', 'photocopying', 'binding', 'business_cards'],
 '{"monday": "8:00-20:00", "tuesday": "8:00-20:00", "wednesday": "8:00-20:00", "thursday": "8:00-20:00", "friday": "8:00-20:00", "saturday": "9:00-18:00", "sunday": "closed"}'::jsonb,
 2),

('Express Printing Services', '789 Lajpat Nagar, New Delhi, 110024', '9876543214', 'info@expressprint.com', 4.9, 234,
 ARRAY['printing', 'large_format', 'binding', 'lamination', 'cutting'],
 '{"monday": "7:00-22:00", "tuesday": "7:00-22:00", "wednesday": "7:00-22:00", "thursday": "7:00-22:00", "friday": "7:00-22:00", "saturday": "8:00-20:00", "sunday": "10:00-18:00"}'::jsonb,
 2);

-- Update shop_id for shop owner
UPDATE users SET shop_id = 1 WHERE email = 'shop@printeasy.com';

-- Insert sample orders for testing
INSERT INTO orders (id, customer_id, shop_id, customer_name, customer_phone, order_type, status, description, special_instructions, pages, copies, paper_type, binding, color, total_amount) VALUES
('UF' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0'), 1, 1, 'Test Customer', '9876543210', 'uploaded-files', 'new', 'Business presentation printing', 'High quality paper preferred', 25, 3, 'A4', 'spiral', true, 75.00),

('UF' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0'), 1, 1, 'Test Customer', '9876543210', 'uploaded-files', 'processing', 'Resume printing', 'Black and white only', 2, 5, 'A4', 'none', false, 10.00),

('WI' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0'), 1, 2, 'Test Customer', '9876543210', 'walk-in', 'confirmed', 'Photocopying documents', 'Need urgent service', 50, 1, 'A4', 'none', false, 25.00),

('UF' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0'), 1, 3, 'Test Customer', '9876543210', 'uploaded-files', 'ready', 'Wedding invitation cards', 'Premium card stock', 100, 1, 'A5', 'none', true, 500.00);

-- Insert sample messages
INSERT INTO messages (order_id, sender_id, recipient_id, message, sender_name) VALUES
((SELECT id FROM orders LIMIT 1), 1, 2, 'Hello, when will my order be ready?', 'Test Customer'),
((SELECT id FROM orders LIMIT 1), 2, 1, 'Your order will be ready by tomorrow morning. Thank you!', 'Test Shop Owner');

-- Insert sample notifications
INSERT INTO notifications (user_id, order_id, title, message, type) VALUES
(1, (SELECT id FROM orders LIMIT 1), 'Order Confirmed', 'Your order has been confirmed and is being processed.', 'info'),
(2, (SELECT id FROM orders LIMIT 1), 'New Order Received', 'You have received a new order for processing.', 'order');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_shop ON orders(customer_id, shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_type ON orders(status, order_type);
CREATE INDEX IF NOT EXISTS idx_messages_order_sender ON messages(order_id, sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_shops_location ON shops USING GIN(to_tsvector('english', address));
CREATE INDEX IF NOT EXISTS idx_orders_created_urgent ON orders(created_at DESC, is_urgent DESC);
