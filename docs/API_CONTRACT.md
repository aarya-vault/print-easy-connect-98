
# PrintEasy API Contract & Type Definitions

## Frontend-Backend Contract Agreement

This document establishes the definitive contract between our Node.js/Express/PostgreSQL backend and React/TypeScript frontend.

### Core Principles
1. **Single Source of Truth**: All API types defined in `src/types/api.ts`
2. **Consistent ID Types**: All model IDs are `string` (UUIDs)
3. **Standardized Enums**: Backend and frontend must use identical enum values
4. **Response Structure**: API service layer always returns `response.data`

### Database Schema Alignment

#### Users Table
```sql
- id: UUID PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- email: VARCHAR(255) UNIQUE
- phone: VARCHAR(20) UNIQUE
- role: ENUM('customer', 'shop_owner', 'admin')
- is_active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Shops Table
```sql
- id: UUID PRIMARY KEY
- owner_id: UUID REFERENCES users(id)
- name: VARCHAR(255) NOT NULL
- slug: VARCHAR(255) UNIQUE
- address: TEXT NOT NULL
- phone: VARCHAR(20) NOT NULL
- email: VARCHAR(255) NOT NULL
- is_active: BOOLEAN DEFAULT true
- allows_offline_orders: BOOLEAN DEFAULT true
- shop_timings: VARCHAR(255) DEFAULT 'Mon-Sat: 9:00 AM - 7:00 PM'
- qr_code_url: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Orders Table
```sql
- id: UUID PRIMARY KEY
- customer_id: UUID REFERENCES users(id)
- shop_id: UUID REFERENCES shops(id)
- customer_name: VARCHAR(255)
- customer_phone: VARCHAR(20)
- order_type: ENUM('digital', 'walkin')
- notes: TEXT (replaces description)
- status: ENUM('pending', 'in_progress', 'ready', 'completed', 'cancelled')
- is_urgent: BOOLEAN DEFAULT false
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### API Response Standards

All successful API responses follow this structure:
```typescript
{
  success: true,
  data: T, // The actual payload
  message?: string
}
```

Error responses:
```typescript
{
  success: false,
  error: string,
  code?: string
}
```

### Critical Type Mappings

1. **Order Status**: Backend uses `pending | in_progress | ready | completed | cancelled`
2. **Order Type**: Backend uses `digital | walkin` (NOT `uploaded-files`)
3. **User Roles**: `customer | shop_owner | admin`
4. **IDs**: Always `string` (UUID format)
