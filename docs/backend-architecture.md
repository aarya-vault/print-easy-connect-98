
# PrintEasy Backend Architecture

## Database Schema
```mermaid
erDiagram
    users ||--o{ shops : owns
    users ||--o{ orders : places
    users ||--o{ messages : sends
    shops ||--o{ orders : receives
    orders ||--o{ files : contains
    orders ||--o{ messages : about

    users {
        int id PK
        string phone UK
        string email UK
        string name
        string password
        enum role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    shops {
        int id PK
        int owner_id FK
        string name
        text address
        string phone
        string email
        string description
        decimal rating
        boolean is_active
        boolean allows_offline_orders
        timestamp created_at
        timestamp updated_at
    }

    orders {
        string id PK
        int shop_id FK
        int customer_id FK
        string customer_name
        string customer_phone
        enum order_type
        text description
        enum status
        boolean is_urgent
        timestamp created_at
        timestamp updated_at
    }

    files {
        int id PK
        string order_id FK
        string filename
        string original_name
        text file_path
        bigint file_size
        string mime_type
        timestamp created_at
        timestamp updated_at
    }

    messages {
        int id PK
        string order_id FK
        int sender_id FK
        text message
        boolean is_read
        timestamp created_at
        timestamp updated_at
    }
```

## API Routes Structure
```mermaid
graph TD
    A[API Base URL] --> B[/auth]
    A --> C[/shops]
    A --> D[/orders]
    A --> E[/files]
    A --> F[/chat]
    A --> G[/admin]

    B --> B1[POST /phone-login]
    B --> B2[POST /email-login]
    B --> B3[PATCH /update-profile]
    B --> B4[GET /me]
    B --> B5[POST /logout]

    C --> C1[GET / - All shops]
    C --> C2[GET /visited - Customer's visited shops]
    C --> C3[GET /:shopId - Shop details]

    D --> D1[POST / - Create order]
    D --> D2[GET /customer - Customer orders]
    D --> D3[GET /shop - Shop orders]
    D --> D4[PATCH /:orderId/status]
    D --> D5[PATCH /:orderId/urgency]

    E --> E1[POST /upload/:orderId]
    E --> E2[GET /order/:orderId]
    E --> E3[GET /download/:fileId]
    E --> E4[DELETE /:fileId]

    F --> F1[GET /order/:orderId]
    F --> F2[POST /send]
    F --> F3[GET /unread-count]

    G --> G1[GET /stats]
    G --> G2[GET /users]
    G --> G3[GET /shops]
    G --> G4[POST /shops]
    G --> G5[PATCH /users/:userId/status]
    G --> G6[DELETE /users/:userId]
```

## Authentication Flow
```mermaid
sequenceDiagram
    participant C as Customer
    participant S as Shop Owner
    participant A as Admin
    participant API as API Server
    participant DB as Database

    Note over C,DB: Customer Phone Login
    C->>API: POST /auth/phone-login {phone}
    API->>DB: Find user by phone
    alt User exists
        DB-->>API: Return user
    else User not found
        API->>DB: Create new customer
        DB-->>API: Return new user
    end
    API->>API: Generate JWT token
    API-->>C: Return {token, user}

    Note over S,DB: Shop Owner Email Login
    S->>API: POST /auth/email-login {email, password}
    API->>DB: Find user by email
    DB-->>API: Return user with hashed password
    API->>API: Compare password with bcrypt
    alt Password valid
        API->>API: Generate JWT token
        API-->>S: Return {token, user, shop_info}
    else Password invalid
        API-->>S: Return 401 error
    end

    Note over A,DB: Admin Email Login
    A->>API: POST /auth/email-login {email, password}
    API->>DB: Find admin user
    API->>API: Validate password and role
    API-->>A: Return {token, user}
```

## Order Creation Flow
```mermaid
sequenceDiagram
    participant C as Customer
    participant API as API Server
    participant DB as Database
    participant FS as File System

    C->>API: POST /orders {shopId, files, description}
    API->>API: Authenticate customer
    API->>API: Generate order ID (UF000001/WI000001)
    API->>DB: Create order record
    
    alt Has files
        loop For each file
            API->>FS: Save file to /uploads/orderId/
            API->>DB: Create file record
        end
    end
    
    API->>DB: Get complete order with relations
    API-->>C: Return {order, files}
    
    Note over API: Notify shop owner via socket
```

## Business Logic: Visited Shops
```mermaid
flowchart TD
    A[Customer selects New Order] --> B[Check visited shops]
    B --> C{Has previous orders?}
    
    C -->|Yes| D[Query shops with customer orders]
    C -->|No| E[Query all active shops]
    
    D --> F[Return visited shops list]
    E --> G[Return all shops list]
    
    F --> H[Show reorder dropdown]
    G --> I[Show all shops dropdown]
    
    H --> J[Customer selects familiar shop]
    I --> K[Customer selects any shop]
    
    J --> L[Create order]
    K --> L
```

## Role-Based Access Control
```mermaid
graph TD
    A[Request] --> B[Authentication Middleware]
    B --> C{Valid Token?}
    C -->|No| D[Return 401]
    C -->|Yes| E[Extract User Role]
    
    E --> F{Check Route Access}
    F -->|Customer| G[Customer Routes]
    F -->|Shop Owner| H[Shop Routes]
    F -->|Admin| I[Admin Routes]
    
    G --> J[Dashboard, Orders, Profile]
    H --> K[Dashboard, Order Management]
    I --> L[User Management, Shop Management, Stats]
    
    F -->|Unauthorized| M[Return 403]
```
