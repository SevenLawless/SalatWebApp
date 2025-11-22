# Quick Fix for Railway Network Error

## The Problem
You're seeing:
- "Network error. Please check your connection"
- `ERR_CONNECTION_REFUSED` for `localhost:3000/api/auth/signin`

This happens because your frontend is trying to connect to `localhost` instead of your Railway backend.

## The Solution (5 minutes)

### Step 1: Find Your Backend URL
1. Go to Railway dashboard
2. Click on your **Backend service**
3. Go to **Settings** tab
4. Under **Domains**, you'll see a URL like: `https://your-backend-production.up.railway.app`
5. **Copy this URL**

### Step 2: Set Frontend Environment Variable
1. Go to your **Frontend service** in Railway
2. Click on **Variables** tab
3. Click **+ New Variable**
4. Add:
   - **Variable**: `VITE_API_URL`
   - **Value**: `https://your-backend-production.up.railway.app/api`
   - ⚠️ Replace `your-backend-production.up.railway.app` with your actual backend URL
5. Click **Add**

### Step 3: Rebuild Frontend
1. Railway will automatically detect the new environment variable
2. Go to **Deployments** tab in your Frontend service
3. Click **Redeploy** (or wait for auto-redeploy)
4. Wait for the build to complete (2-3 minutes)

### Step 4: Update Backend CORS (if needed)
1. Go to your **Backend service** → **Variables**
2. Find `FRONTEND_URL` variable
3. Make sure it's set to your frontend Railway URL (e.g., `https://your-frontend-production.up.railway.app`)
4. If you changed it, **Redeploy** the backend service

### Step 5: Test
1. Go to your frontend URL
2. Try to sign up or log in
3. It should work now! ✅

## Still Not Working?

### Check Backend is Running
1. Go to Backend service → **Logs**
2. You should see: `Server running on port 3000`
3. If you see errors, check:
   - Database connection (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
   - JWT_SECRET is set

### Test Backend Directly
1. Open your backend URL in browser: `https://your-backend.railway.app/health`
2. You should see: `{"status":"ok","message":"SalatChecker API is running"}`
3. If this doesn't work, your backend isn't running properly

### Verify Environment Variables
**Frontend service should have:**
```
VITE_API_URL=https://your-backend.railway.app/api
```

**Backend service should have:**
```
DB_HOST=... (from MySQL service MYSQLHOST)
DB_USER=... (from MySQL service MYSQLUSER)
DB_PASSWORD=... (from MySQL service MYSQLPASSWORD)
DB_NAME=... (from MySQL service MYSQLDATABASE)
JWT_SECRET=... (create your own, min 32 chars)
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
```

**📖 Don't know where to find MySQL credentials?** See `RAILWAY_MYSQL_SETUP.md` for detailed instructions!

## Common Mistakes

❌ **Wrong**: `VITE_API_URL=http://localhost:3000/api`
✅ **Correct**: `VITE_API_URL=https://your-backend.railway.app/api`

❌ **Wrong**: `VITE_API_URL=https://your-backend.railway.app` (missing `/api`)
✅ **Correct**: `VITE_API_URL=https://your-backend.railway.app/api`

❌ **Wrong**: Setting the variable but not rebuilding
✅ **Correct**: Railway auto-rebuilds, but you can manually trigger **Redeploy**

## Need More Help?

See `RAILWAY_DEPLOYMENT.md` for complete deployment guide.

