
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting PrintEasy Backend Server...\n');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully!\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚙️ Creating environment file...');
  const envContent = `# PrintEasy Backend Configuration
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_shop
DB_USER=postgres
DB_PASSWORD=password

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=50MB
UPLOAD_DIR=uploads
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created!\n');
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory\n');
}

// Start the server
console.log('🔥 Starting PrintEasy API Server...');
console.log('📍 Server will run on: http://localhost:3001');
console.log('📱 Frontend should run on: http://localhost:3000');
console.log('🔧 Press Ctrl+C to stop the server\n');

try {
  require('./app.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure PostgreSQL is installed and running');
  console.log('2. Check database credentials in .env file');
  console.log('3. Ensure port 3001 is not in use');
  process.exit(1);
}
