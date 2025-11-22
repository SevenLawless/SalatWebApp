# Troubleshooting 502 Bad Gateway Error

If you're seeing **502 Bad Gateway** or **Application failed to respond**, your backend service isn't running properly.

## Quick Diagnosis Steps

### Step 1: Check Backend Logs

1. Go to Railway dashboard
2. Click on your **Backend service**
3. Click on **"Logs"** tab
4. Look at the **most recent logs** (scroll to bottom)

**What to look for:**

✅ **Good signs:**
- `Server running on port 3000`
- `Database connection successful`
- `Environment: production`

❌ **Bad signs (errors):**
- `Database connection failed`
- `Missing required database environment variables`
- `Error: Cannot find module`
- `EADDRINUSE: address already in use`
- Any red error messages

### Step 2: Check Environment Variables

Go to **Backend service** → **Variables** tab and verify you have ALL of these:

- [ ] `DB_HOST` - Should be from MySQL service `MYSQLHOST`
- [ ] `DB_USER` - Should be from MySQL service `MYSQLUSER`
- [ ] `DB_PASSWORD` - Should be from MySQL service `MYSQLPASSWORD`
- [ ] `DB_NAME` - Should be from MySQL service `MYSQLDATABASE`
- [ ] `JWT_SECRET` - Your own random string (32+ characters)
- [ ] `PORT` - Should be `3000` (Railway also sets this automatically)
- [ ] `NODE_ENV` - Should be `production`
- [ ] `FRONTEND_URL` - Your frontend Railway URL

**Common mistakes:**
- ❌ Missing one or more variables
- ❌ Extra spaces in values
- ❌ Wrong values copied from MySQL service
- ❌ `DB_HOST` includes `http://` or `https://` (should be just the hostname)

### Step 3: Verify Database Connection

1. Go to **MySQL service** → **Variables**
2. Copy the values again (they might have changed)
3. Go to **Backend service** → **Variables**
4. Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` with fresh values
5. Make sure there are **no extra spaces** before or after values

### Step 4: Check Service Status

1. In Railway dashboard, look at your **Backend service**
2. Check the status indicator:
   - 🟢 **Green** = Running (but might still have errors)
   - 🟡 **Yellow** = Building/Deploying
   - 🔴 **Red** = Failed/Crashed

### Step 5: Check Build Logs

1. Go to **Backend service** → **Deployments** tab
2. Click on the latest deployment
3. Check if the build succeeded
4. Look for any build errors

---

## Common Issues and Solutions

### Issue 1: "Database connection failed"

**Symptoms:**
- Logs show: `Database connection failed: ...`
- Error mentions "ECONNREFUSED" or "Access denied"

**Solutions:**

1. **Verify MySQL service is running:**
   - Go to MySQL service
   - Status should be green
   - If not, wait for it to finish provisioning

2. **Check database variables are correct:**
   - Go to MySQL service → Variables
   - Copy `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` again
   - Go to Backend service → Variables
   - Update all 4 database variables with fresh values
   - Make sure `DB_HOST` doesn't have `http://` or `https://`

3. **Verify database tables exist:**
   - Make sure you ran `database/schema-railway.sql` in Step 7
   - If not, go back and create the tables

4. **Check database name matches:**
   - `DB_NAME` should match `MYSQLDATABASE` exactly
   - Usually it's `railway` (Railway's default)

### Issue 2: "Missing required database environment variables"

**Symptoms:**
- Logs show: `Missing required database environment variables: DB_HOST, DB_USER, ...`

**Solution:**
1. Go to **Backend service** → **Variables**
2. Add the missing variables
3. Copy values from **MySQL service** → **Variables**
4. Save and wait for redeploy

### Issue 3: "Cannot find module" or Import Errors

**Symptoms:**
- Logs show: `Error: Cannot find module 'express'` or similar

**Solution:**
1. Check **Backend service** → **Settings** → **Root Directory**
2. Should be set to: `server`
3. If wrong, update it and redeploy

### Issue 4: Port Already in Use

**Symptoms:**
- Logs show: `EADDRINUSE: address already in use :::3000`

**Solution:**
1. Railway handles ports automatically
2. Make sure `PORT` variable is set to `3000` OR remove it (Railway will set it)
3. Redeploy the service

### Issue 5: Service Keeps Restarting

**Symptoms:**
- Service status keeps changing
- Logs show server starting then immediately crashing

**Solution:**
1. Check logs for the error message
2. Most common causes:
   - Database connection failing
   - Missing environment variable
   - Syntax error in code
3. Fix the underlying issue and Railway will auto-redeploy

---

## Step-by-Step Fix Process

If you're still getting 502 errors, follow these steps in order:

### 1. Verify MySQL Service
- [ ] MySQL service is running (green status)
- [ ] MySQL service has all variables (`MYSQLHOST`, `MYSQLUSER`, etc.)

### 2. Verify Backend Environment Variables
- [ ] All 8 variables are set in Backend service
- [ ] Values are copied correctly from MySQL service
- [ ] No extra spaces in values
- [ ] `DB_HOST` is just the hostname (no http://)

### 3. Verify Database Tables
- [ ] You ran `database/schema-railway.sql` in Step 7
- [ ] Tables `users` and `prayer_records` exist

### 4. Check Backend Service Settings
- [ ] Root Directory is set to `server`
- [ ] Start Command is `npm start`
- [ ] Build Command is empty or `npm install`

### 5. Check Logs for Specific Errors
- [ ] Read the full error message
- [ ] Look for the specific issue mentioned above
- [ ] Fix that specific issue

### 6. Redeploy
- [ ] After fixing issues, Railway should auto-redeploy
- [ ] Or manually click **"Redeploy"** in Deployments tab
- [ ] Wait 2-3 minutes for deployment

### 7. Test Again
- [ ] Check logs for "Server running on port 3000"
- [ ] Test health endpoint: `https://your-backend.railway.app/health`

---

## Still Not Working?

If you've tried everything above:

1. **Check Railway Status**: Go to https://status.railway.app - check if Railway is having issues

2. **Verify Your Code**: Make sure your code is pushed to GitHub and Railway is pulling the latest version

3. **Try Manual Redeploy**:
   - Go to Backend service → Deployments
   - Click "Redeploy"
   - Wait for it to complete

4. **Check Service Limits**: Free tier has limits - make sure you haven't exceeded them

5. **Contact Support**: If nothing works, check Railway logs and contact Railway support with the error messages

---

## Quick Checklist

Before asking for help, verify:

- [ ] MySQL service is running
- [ ] All 8 backend environment variables are set
- [ ] Database variables match MySQL service variables
- [ ] Database tables are created
- [ ] Backend service Root Directory is `server`
- [ ] Backend logs show "Server running on port 3000"
- [ ] No red error messages in logs
- [ ] Service status is green

---

## Expected Log Output (When Working)

When your backend is working correctly, you should see in the logs:

```
✅ Database connection successful
Server running on port 3000
Environment: production
Database: containers-us-west-xxx.railway.app
```

If you see this, your backend is working! If the health endpoint still doesn't work, it might be a Railway routing issue - wait a few minutes and try again.

