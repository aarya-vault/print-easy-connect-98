
# PrintEasy Deployment Guide

## Production Environment Setup

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or later
- **RAM**: Minimum 4GB, Recommended 8GB+
- **CPU**: 2+ cores, Recommended 4+ cores
- **Storage**: 100GB SSD minimum
- **Network**: High-speed internet with stable connection

### Technology Stack
- **Runtime**: Node.js 18+ LTS
- **Database**: PostgreSQL 14+
- **Web Server**: Nginx (reverse proxy)
- **Process Manager**: PM2
- **SSL**: Let's Encrypt certificates
- **Monitoring**: Winston logging + system monitoring

## Environment Configuration

### 1. System Dependencies
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 2. Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE printeasy_production;
CREATE USER printeasy_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE printeasy_production TO printeasy_user;
\q
```

### 3. Application Setup
```bash
# Clone repository
git clone https://github.com/your-repo/printeasy.git
cd printeasy

# Install backend dependencies
cd backend
npm install --production

# Install frontend dependencies and build
cd ../
npm install
npm run build
```

### 4. Environment Variables
Create `/home/printeasy/backend/.env`:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_production
DB_USER=printeasy_user
DB_PASSWORD=your_secure_password_here

# Application Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=your_super_secure_jwt_secret_here_minimum_32_characters

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# File Upload Configuration
UPLOAD_PATH=/home/printeasy/uploads
MAX_FILE_SIZE=100MB

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring and Logging
LOG_LEVEL=info
LOG_FILE=/home/printeasy/logs/app.log
```

## Database Migration

### 1. Initialize Database Schema
```bash
cd /home/printeasy/backend
node -e "
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function migrate() {
  try {
    const schema = fs.readFileSync('./database/complete-schema.sql', 'utf8');
    await pool.query(schema);
    console.log('Database schema created successfully');
    
    const testData = fs.readFileSync('./database/test-data.sql', 'utf8');
    await pool.query(testData);
    console.log('Test data inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
"
```

## Application Deployment

### 1. PM2 Configuration
Create `/home/printeasy/backend/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'printeasy-api',
    script: './enhanced-production-server.js',
    cwd: '/home/printeasy/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/home/printeasy/logs/err.log',
    out_file: '/home/printeasy/logs/out.log',
    log_file: '/home/printeasy/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 2. Start Application
```bash
# Create logs directory
mkdir -p /home/printeasy/logs

# Start application with PM2
cd /home/printeasy/backend
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u printeasy --hp /home/printeasy
```

## Nginx Configuration

### 1. Create Nginx Configuration
Create `/etc/nginx/sites-available/printeasy`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=uploads:10m rate=5r/s;
    
    # Frontend - Serve React build
    location / {
        root /home/printeasy/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # WebSocket Support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # File Uploads - Larger body size and rate limiting
    location /api/files/ {
        limit_req zone=uploads burst=10 nodelay;
        client_max_body_size 0;  # No limit as requested
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 600s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 600s;
    }
    
    # Uploaded Files - Direct serving with security
    location /uploads/ {
        alias /home/printeasy/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        
        # Security: Only serve to authenticated users
        # Add authentication check here if needed
    }
    
    # Health Check
    location /health {
        proxy_pass http://localhost:3001/api/health;
        access_log off;
    }
}
```

### 2. Enable Configuration
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/printeasy /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## SSL Certificate Setup

### 1. Install Certbot
```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2. Obtain SSL Certificate
```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start Nginx
sudo systemctl start nginx

# Setup auto-renewal
sudo crontab -e
# Add line: 0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

## Monitoring and Logging

### 1. System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Setup log rotation
sudo nano /etc/logrotate.d/printeasy
```

Add to logrotate config:
```
/home/printeasy/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 printeasy printeasy
    postrotate
        pm2 reload printeasy-api
    endscript
}
```

### 2. Database Monitoring
```bash
# Install PostgreSQL monitoring
sudo apt install postgresql-contrib -y

# Enable logging in PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Enable these settings:
```
log_statement = 'all'
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

## Backup Strategy

### 1. Database Backup
Create `/home/printeasy/scripts/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/home/printeasy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U printeasy_user printeasy_production > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### 2. File Backup
Create `/home/printeasy/scripts/backup-files.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/home/printeasy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup uploaded files
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz -C /home/printeasy uploads/

# Remove file backups older than 7 days
find $BACKUP_DIR -name "files_backup_*.tar.gz" -mtime +7 -delete

echo "Files backup completed: files_backup_$DATE.tar.gz"
```

### 3. Automated Backups
```bash
# Make scripts executable
chmod +x /home/printeasy/scripts/*.sh

# Add to crontab
crontab -e
```

Add these lines:
```
# Daily database backup at 2 AM
0 2 * * * /home/printeasy/scripts/backup-db.sh >> /home/printeasy/logs/backup.log 2>&1

# Weekly file backup on Sundays at 3 AM
0 3 * * 0 /home/printeasy/scripts/backup-files.sh >> /home/printeasy/logs/backup.log 2>&1
```

## Security Hardening

### 1. Firewall Configuration
```bash
# Install UFW
sudo apt install ufw -y

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (change port if needed)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (local only)
sudo ufw allow from 127.0.0.1 to any port 5432

# Enable firewall
sudo ufw enable
```

### 2. System Security
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install fail2ban
sudo apt install fail2ban -y

# Configure fail2ban for Nginx
sudo nano /etc/fail2ban/jail.local
```

Add to fail2ban config:
```
[DEFAULT]
bantime = 1800
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
```

## Performance Optimization

### 1. Node.js Optimization
```bash
# Increase system limits
sudo nano /etc/security/limits.conf
```

Add:
```
printeasy soft nofile 65536
printeasy hard nofile 65536
```

### 2. PostgreSQL Optimization
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Optimize for production:
```
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
max_connections = 100
```

## Health Checks and Monitoring

### 1. Application Health Check
Create `/home/printeasy/scripts/health-check.sh`:
```bash
#!/bin/bash
API_URL="http://localhost:3001/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "API is healthy"
    exit 0
else
    echo "API is down (HTTP $RESPONSE)"
    # Restart application
    pm2 restart printeasy-api
    exit 1
fi
```

### 2. System Monitoring
```bash
# Add to crontab for every 5 minutes
*/5 * * * * /home/printeasy/scripts/health-check.sh >> /home/printeasy/logs/health.log 2>&1
```

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database schema migrated
- [ ] SSL certificates obtained
- [ ] Nginx configuration tested
- [ ] PM2 ecosystem configured
- [ ] Firewall rules applied
- [ ] Backup scripts tested

### Post-Deployment
- [ ] Application responding on HTTPS
- [ ] API endpoints functional
- [ ] WebSocket connections working
- [ ] File uploads working
- [ ] Database queries optimized
- [ ] Monitoring alerts configured
- [ ] Backup automation verified
- [ ] Security scanning completed

## Maintenance Procedures

### Regular Maintenance (Weekly)
- Monitor system resources (CPU, RAM, disk)
- Review application logs for errors
- Check database performance
- Verify backup integrity
- Update security patches

### Monthly Maintenance
- Analyze usage patterns and optimize
- Review and update dependencies
- Performance benchmarking
- Security audit
- Capacity planning review

This deployment guide ensures a secure, scalable, and maintainable production environment for the PrintEasy platform.
