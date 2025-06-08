
# User Management Guide

## Adding New Users

### 1. Customer Registration
Customers can self-register through the platform:

**Phone-based Registration**
```bash
POST /api/auth/phone-login
{
  "phone": "9876543210"
}
```

**Email-based Registration (for shop owners/admins)**
```bash
POST /api/auth/email-login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### 2. Shop Owner Onboarding

**Step 1: Create User Account**
```sql
INSERT INTO users (name, email, phone, role, password_hash) 
VALUES ('Shop Owner Name', 'owner@shop.com', '9876543210', 'shop_owner', '$2b$10$...');
```

**Step 2: Create Shop Profile**
```sql
INSERT INTO shops (name, address, phone, email, owner_id, services, operating_hours)
VALUES (
  'Quick Print Shop',
  '123 Main Street, Delhi',
  '9876543210',
  'shop@quickprint.com',
  [user_id],
  ARRAY['printing', 'binding', 'lamination'],
  '{"monday": "9:00-18:00", "tuesday": "9:00-18:00"}'::jsonb
);
```

### 3. Admin User Creation

**Direct Database Method**
```sql
INSERT INTO users (name, email, phone, role, password_hash, is_active)
VALUES (
  'Admin User',
  'admin@printeasy.com', 
  '9999999999',
  'admin',
  '$2b$10$[bcrypt_hash]',
  true
);
```

**API Method (for existing admins)**
```bash
POST /api/admin/users
Authorization: Bearer [admin_jwt_token]
{
  "name": "New Admin",
  "email": "newadmin@printeasy.com",
  "phone": "9888888888",
  "role": "admin",
  "password": "AdminPassword123!"
}
```

## User Management Operations

### Update User Information
```bash
PATCH /api/users/:userId
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "is_active": true
}
```

### Deactivate User
```bash
PATCH /api/users/:userId
{
  "is_active": false
}
```

### Change User Role
```bash
PATCH /api/admin/users/:userId/role
{
  "role": "shop_owner"
}
```

### Delete User (Soft Delete)
```bash
DELETE /api/admin/users/:userId
```

## Bulk User Operations

### Import Users from CSV
```bash
POST /api/admin/users/bulk-import
Content-Type: multipart/form-data
[CSV file with columns: name, email, phone, role]
```

### Export User Data
```bash
GET /api/admin/users/export?format=csv&role=customer
```

## User Search & Filtering

### Search Users
```bash
GET /api/admin/users?search=john&role=customer&status=active&page=1&limit=50
```

### Advanced Filters
- By registration date range
- By activity level
- By shop association
- By order count

## Role-Based Access Control

### Permission Matrix
| Action | Customer | Shop Owner | Admin |
|--------|----------|------------|-------|
| Place Orders | ✅ | ❌ | ✅ |
| Manage Shop Orders | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Shop Management | ❌ | Own Shop | All Shops |
| System Analytics | ❌ | Own Shop | Platform Wide |

### Test Login Credentials

**Customer Account**
- Phone: `9876543210`
- Login Type: Phone-based (SMS verification simulation)

**Shop Owner Account**
- Email: `shop@printeasy.com`
- Password: `ShopOwner123!`
- Shop: Quick Print Solutions

**Admin Account**
- Email: `admin@printeasy.com`
- Password: `Admin123!`
- Full platform access

## Database Maintenance

### Regular Cleanup Tasks
```sql
-- Remove old uploaded files (30+ days)
DELETE FROM order_files 
WHERE created_at < NOW() - INTERVAL '30 days'
AND order_id IN (
  SELECT id FROM orders WHERE status = 'completed'
);

-- Archive old orders (6+ months)
INSERT INTO archived_orders SELECT * FROM orders 
WHERE created_at < NOW() - INTERVAL '6 months';

-- Update user statistics
UPDATE users SET 
  total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = users.id),
  last_activity = (SELECT MAX(created_at) FROM orders WHERE customer_id = users.id);
```

### Backup Procedures
```bash
# Daily database backup
pg_dump printeasy_db > backup_$(date +%Y%m%d).sql

# File system backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```
