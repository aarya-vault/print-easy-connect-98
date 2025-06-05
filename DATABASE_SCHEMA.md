
# PrintEasy Database Schema Documentation

## Overview
This document outlines the PostgreSQL database schema for the PrintEasy application. The schema is designed to handle print shop management, customer orders, file uploads, and order tracking.

## Database Tables

### 1. shops
Stores information about print shops registered in the system.

```sql
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '18:00:00',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_active ON shops(is_active);
```

### 2. customers
Stores customer information.

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
```

### 3. orders
Main orders table storing all print orders.

```sql
CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY, -- Custom format: UF123456 or WI123456
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('uploaded-files', 'walk-in')),
    description TEXT NOT NULL,
    instructions TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled')),
    is_urgent BOOLEAN DEFAULT false,
    pages INTEGER,
    copies INTEGER DEFAULT 1,
    paper_type VARCHAR(100),
    binding VARCHAR(100),
    is_color BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_orders_urgent ON orders(is_urgent);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 4. order_files
Stores uploaded files associated with orders.

```sql
CREATE TABLE order_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(20) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_order_files_order_id ON order_files(order_id);
```

### 5. order_services
Junction table for order services (many-to-many relationship).

```sql
CREATE TABLE order_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(20) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL
);

-- Indexes
CREATE INDEX idx_order_services_order_id ON order_services(order_id);
```

### 6. order_status_history
Tracks order status changes for audit purposes.

```sql
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(20) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50) NOT NULL, -- 'customer', 'shop_owner', 'admin'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Indexes
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_changed_at ON order_status_history(changed_at);
```

### 7. shop_services
Available services for each shop.

```sql
CREATE TABLE shop_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_shop_services_shop_id ON shop_services(shop_id);
```

### 8. shop_equipment
Equipment available at each shop.

```sql
CREATE TABLE shop_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    equipment_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_shop_equipment_shop_id ON shop_equipment(shop_id);
```

### 9. customer_shop_visits
Tracks customer visits to shops for analytics.

```sql
CREATE TABLE customer_shop_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    visit_count INTEGER DEFAULT 1,
    last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_customer_shop_visits_customer_id ON customer_shop_visits(customer_id);
CREATE INDEX idx_customer_shop_visits_shop_id ON customer_shop_visits(shop_id);
CREATE UNIQUE INDEX idx_customer_shop_unique ON customer_shop_visits(customer_id, shop_id);
```

## Database Functions and Triggers

### 1. Update Timestamp Trigger
Automatically update the `updated_at` field when records are modified.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Order Status History Trigger
Automatically log status changes.

```sql
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, 'system');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_order_status_changes 
    AFTER UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION log_order_status_change();
```

### 3. Order ID Generation Function
Generate custom order IDs with prefixes.

```sql
CREATE OR REPLACE FUNCTION generate_order_id(order_type VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    prefix VARCHAR(2);
    sequence_num INTEGER;
    new_id VARCHAR(20);
BEGIN
    -- Set prefix based on order type
    IF order_type = 'uploaded-files' THEN
        prefix := 'UF';
    ELSIF order_type = 'walk-in' THEN
        prefix := 'WI';
    ELSE
        RAISE EXCEPTION 'Invalid order type: %', order_type;
    END IF;
    
    -- Get next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 3) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM orders
    WHERE id LIKE prefix || '%';
    
    -- Generate new ID
    new_id := prefix || LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

## Sample Data Insertion

```sql
-- Insert sample shop
INSERT INTO shops (name, slug, email, phone, address, owner_name) VALUES 
('Quick Print Solutions', 'quick-print-solutions', 'owner@quickprint.com', '+91 98765 43210', 'Shop 12, MG Road, Bangalore, Karnataka 560001', 'Rajesh Gupta');

-- Insert sample customer
INSERT INTO customers (name, phone, email) VALUES 
('Priya Sharma', '+91 87654 32109', 'priya.sharma@email.com');

-- Insert sample order
INSERT INTO orders (id, shop_id, customer_id, order_type, description, status, is_urgent, pages, copies) VALUES 
('UF000001', (SELECT id FROM shops WHERE slug = 'quick-print-solutions'), (SELECT id FROM customers WHERE phone = '+91 87654 32109'), 'uploaded-files', 'Resume printing - 10 copies, premium paper', 'new', true, 2, 10);
```

## Performance Optimization

### 1. Partitioning Strategy
For high-volume deployments, consider partitioning the orders table by date:

```sql
-- Create partitioned orders table
CREATE TABLE orders_partitioned (
    LIKE orders INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE orders_2024_01 PARTITION OF orders_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 2. Archival Strategy
Archive completed orders older than 1 year:

```sql
CREATE TABLE orders_archive (
    LIKE orders INCLUDING ALL
);

-- Move old completed orders to archive
INSERT INTO orders_archive 
SELECT * FROM orders 
WHERE status = 'completed' 
AND created_at < CURRENT_DATE - INTERVAL '1 year';
```

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS on sensitive tables
2. **Data Encryption**: Encrypt customer PII fields
3. **Audit Logging**: Log all data access and modifications
4. **Backup Strategy**: Daily backups with point-in-time recovery
5. **Access Control**: Grant minimal required permissions

## Monitoring and Maintenance

1. **Query Performance**: Monitor slow queries and optimize indexes
2. **Storage Growth**: Track table sizes and plan for scaling
3. **Connection Pooling**: Use pgBouncer for connection management
4. **Health Checks**: Regular database health monitoring
5. **Backup Verification**: Regular backup restoration tests

This schema provides a solid foundation for the PrintEasy application with room for future enhancements and scaling.
