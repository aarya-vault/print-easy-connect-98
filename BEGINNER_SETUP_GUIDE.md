
# PrintEasy Setup Guide for Beginners 🚀

## Step 1: Start the Backend Server
1. Open terminal/command prompt
2. Navigate to the backend folder: `cd backend`
3. Install dependencies: `npm install`
4. Start the server: `node app.js`
5. You should see: "PrintEasy API server running on port 3001"

## Step 2: Database Setup
The database is already configured with PostgreSQL. If you need to set it up:
1. Install PostgreSQL on your computer
2. Create database: `createdb printeasy_shop`
3. Run schema: `psql printeasy_shop < database/schema.sql`
4. Add test data: `psql printeasy_shop < database/test-data.sql`

## Step 3: Test Login Credentials

### Customer Login:
- Phone: `9876543210`
- This will create a new customer account automatically if it doesn't exist

### Shop Owner Login:
- Phone: `9123456789`
- Password: `shopowner123`

### Admin Login:
- Phone: `9000000000`
- Password: `admin123`

## Step 4: Troubleshooting
If you can't login:
1. Make sure backend server is running (Step 1)
2. Check browser console for errors (F12 key)
3. Verify you're using the correct phone numbers above
4. Try refreshing the page

## Step 5: Test the System
1. Login as customer → Upload files → Track order
2. Login as shop owner → Manage orders → Update status
3. Login as admin → Manage users and shops

That's it! Your PrintEasy system should now be working perfectly! 🎉
