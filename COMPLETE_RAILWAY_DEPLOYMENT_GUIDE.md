# Complete Railway Deployment Guide - From Scratch

This is your **ONE and ONLY** guide to deploy SalatChecker to Railway. Follow it step-by-step from beginning to end.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Railway Account & Project](#step-1-create-railway-account--project)
3. [Step 2: Connect GitHub Repository](#step-2-connect-github-repository)
4. [Step 3: Set Up MySQL Database](#step-3-set-up-mysql-database)
5. [Step 4: Deploy Backend Service](#step-4-deploy-backend-service)
6. [Step 5: Deploy Frontend Service](#step-5-deploy-frontend-service)
7. [Step 6: Configure Environment Variables](#step-6-configure-environment-variables)
8. [Step 7: Create Database Tables](#step-7-create-database-tables)
9. [Step 8: Test Your Application](#step-8-test-your-application)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, make sure you have:

- ✅ A GitHub account
- ✅ Your SalatChecker code pushed to a GitHub repository
- ✅ About 30-45 minutes of time
- ✅ A text editor or notepad to copy/paste values

---

## Step 1: Create Railway Account & Project

### 1.1 Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"** if you already have an account
3. Sign up using:
   - **GitHub** (recommended - easiest)
   - Email
   - Google
4. Complete the sign-up process

### 1.2 Create a New Project

1. Once logged in, you'll see the Railway dashboard
2. Click the **"+ New Project"** button (usually top right or center)
3. Select **"Deploy from GitHub repo"**
4. If this is your first time, Railway will ask to connect your GitHub account
   - Click **"Configure GitHub App"** or **"Authorize Railway"**
   - Select the repositories you want to give Railway access to
   - Click **"Install"** or **"Authorize"**
5. Select your **SalatChecker repository** from the list
6. Click **"Deploy Now"** or **"Add"**

**✅ You should now see your project in Railway dashboard!**

---

## Step 2: Connect GitHub Repository

If you haven't connected GitHub yet:

1. In Railway dashboard, click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub repositories
4. Find and select your **SalatChecker** repository
5. Railway will start analyzing your project

**✅ Your repository is now connected!**

---

## Step 3: Set Up MySQL Database

### 3.1 Add MySQL Service

1. In your Railway project dashboard, click the **"+ New"** button (top right)
2. A menu will appear - click **"Database"**
3. Select **"Add MySQL"**
4. Railway will start provisioning your MySQL database
5. **Wait 1-2 minutes** for it to finish (you'll see a progress indicator)

**✅ MySQL service is now being created!**

### 3.2 Get MySQL Credentials

Once the MySQL service is ready (green status):

1. **Click on the MySQL service** in your project (it will have a MySQL icon)
2. Click on the **"Variables"** tab at the top
3. You'll see Railway automatically created these variables:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLPORT` (you don't need this)
   - `MYSQLDATABASE`

4. **Click on each variable** to reveal its value (they're hidden by default)
5. **Copy each value** to a notepad or text editor:

   ```
   MYSQLHOST = [copy this value]
   MYSQLUSER = [copy this value]
   MYSQLPASSWORD = [copy this value]
   MYSQLDATABASE = [copy this value]
   ```

**⚠️ IMPORTANT: Keep these values safe! You'll need them in Step 6.**

**✅ You now have your MySQL credentials!**

---

## Step 4: Deploy Backend Service

### 4.1 Add Backend Service

1. In your Railway project, click **"+ New"** button again
2. This time, select **"GitHub Repo"** (not Database)
3. Select your **SalatChecker repository** again
4. Railway will detect it's a Node.js project

### 4.2 Configure Backend Service

1. Click on the newly created service (it might be named after your repo)
2. Click on **"Settings"** tab
3. Scroll down to find **"Root Directory"**
4. Set **Root Directory** to: `server`
   - This tells Railway to look in the `server` folder for your backend code
5. Scroll down to **"Build Command"** (optional):
   - Leave it empty or set to: `npm install`
6. Scroll down to **"Start Command"**:
   - Set it to: `npm start`
7. Click **"Save"** or the changes will auto-save

**✅ Backend service is configured!**

### 4.3 Generate Backend Domain

1. Still in the **Settings** tab of your backend service
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"** button
4. Railway will create a URL like: `https://your-backend-production.up.railway.app`
5. **Copy this URL** - you'll need it later!
6. Save it in your notepad

**✅ Backend URL is ready!**

---

## Step 5: Deploy Frontend Service

### 5.1 Add Frontend Service

1. In your Railway project, click **"+ New"** button
2. Select **"GitHub Repo"**
3. Select your **SalatChecker repository** again
4. Railway will create another service

### 5.2 Configure Frontend Service

1. Click on the newly created frontend service
2. Click on **"Settings"** tab
3. **Root Directory**: Leave it as `.` (root of repo) or set it to `.`
4. **Build Command**: Set to: `npm install && npm run build`
5. **Start Command**: Set to: `npm run preview -- --host 0.0.0.0 --port $PORT`
6. Click **"Save"**

**✅ Frontend service is configured!**

### 5.3 Generate Frontend Domain

1. In the **Settings** tab of your frontend service
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"** button
4. Railway will create a URL like: `https://your-frontend-production.up.railway.app`
5. **Copy this URL** - you'll need it later!
6. Save it in your notepad

**✅ Frontend URL is ready!**

---

## Step 6: Configure Environment Variables

This is the **most important step**! Get it right and everything will work.

### 6.1 Backend Service Variables

1. Go to your **Backend service** in Railway
2. Click on **"Variables"** tab
3. Click **"+ New Variable"** button
4. Add each variable one by one:

#### Variable 1: DB_HOST
- **Variable**: `DB_HOST`
- **Value**: Paste the `MYSQLHOST` value you copied in Step 3.2
- Click **"Add"**

#### Variable 2: DB_USER
- Click **"+ New Variable"** again
- **Variable**: `DB_USER`
- **Value**: Paste the `MYSQLUSER` value you copied
- Click **"Add"**

#### Variable 3: DB_PASSWORD
- Click **"+ New Variable"** again
- **Variable**: `DB_PASSWORD`
- **Value**: Paste the `MYSQLPASSWORD` value you copied
- Click **"Add"**

#### Variable 4: DB_NAME
- Click **"+ New Variable"** again
- **Variable**: `DB_NAME`
- **Value**: Paste the `MYSQLDATABASE` value you copied
- Click **"Add"**

#### Variable 5: JWT_SECRET
- Click **"+ New Variable"** again
- **Variable**: `JWT_SECRET`
- **Value**: Create a random string (minimum 32 characters)
  - Example: `my-super-secret-jwt-key-12345678901234567890`
  - You can use a password generator or just type random characters
- Click **"Add"**

#### Variable 6: PORT
- Click **"+ New Variable"** again
- **Variable**: `PORT`
- **Value**: `3000`
- Click **"Add"**

#### Variable 7: NODE_ENV
- Click **"+ New Variable"** again
- **Variable**: `NODE_ENV`
- **Value**: `production`
- Click **"Add"**

#### Variable 8: FRONTEND_URL
- Click **"+ New Variable"** again
- **Variable**: `FRONTEND_URL`
- **Value**: Paste your **frontend URL** from Step 5.3
  - Example: `https://your-frontend-production.up.railway.app`
- Click **"Add"**

**✅ All backend variables are set!**

### 6.2 Frontend Service Variables

1. Go to your **Frontend service** in Railway
2. Click on **"Variables"** tab
3. Click **"+ New Variable"** button

#### Variable: VITE_API_URL
- **Variable**: `VITE_API_URL`
- **Value**: Your **backend URL** from Step 4.3 + `/api`
  - Example: `https://your-backend-production.up.railway.app/api`
  - ⚠️ **IMPORTANT**: Make sure to include `/api` at the end!
- Click **"Add"**

**✅ Frontend variable is set!**

### 6.3 Verify All Variables

**Backend service should have 8 variables:**
- ✅ `DB_HOST`
- ✅ `DB_USER`
- ✅ `DB_PASSWORD`
- ✅ `DB_NAME`
- ✅ `JWT_SECRET`
- ✅ `PORT`
- ✅ `NODE_ENV`
- ✅ `FRONTEND_URL`

**Frontend service should have 1 variable:**
- ✅ `VITE_API_URL`

**✅ All environment variables are configured!**

---

## Step 7: Create Database Tables

Now you need to create the database tables for your application.

### 7.1 Open MySQL Console

1. Go to your **MySQL service** in Railway (the database, not backend)
2. Click on **"Data"** tab (or **"Query"** tab - depends on Railway version)
3. Look for **"Connect"** or **"Open MySQL Console"** button
4. Click it to open the MySQL console

### 7.2 Run the Schema

1. Open the file `database/schema-railway.sql` from your project
2. **Copy ALL the contents** of that file
3. In the Railway MySQL console, **paste the SQL code**
4. Click **"Run"** or **"Execute"** button
5. You should see a success message

**The SQL you're running should look like this:**

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(25) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phoneNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prayer records table
CREATE TABLE IF NOT EXISTS prayer_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  date DATE NOT NULL,
  fajr ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  dhuhr ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  asr ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  maghrib ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  isha ENUM('not_prayed', 'prayed', 'missed') DEFAULT 'not_prayed',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_date (userId, date),
  INDEX idx_user_date (userId, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**✅ Database tables are created!**

---

## Step 8: Test Your Application

### 8.1 Check Backend is Running

1. Go to your **Backend service** in Railway
2. Click on **"Logs"** tab
3. You should see: `Server running on port 3000`
4. If you see errors, check the Troubleshooting section below

### 8.2 Test Backend Health Endpoint

1. Open your backend URL in a browser: `https://your-backend.railway.app/health`
2. You should see: `{"status":"ok","message":"SalatChecker API is running"}`
3. If this works, your backend is running correctly! ✅

### 8.3 Test Frontend

1. Open your frontend URL in a browser: `https://your-frontend.railway.app`
2. You should see your SalatChecker application
3. Try to **sign up** for a new account:
   - Enter a username
   - Enter a phone number (with country code, e.g., +1234567890)
   - Enter a password
   - Click Sign Up
4. If sign up works, try **logging in** with the same credentials

**✅ If sign up and login work, your deployment is successful! 🎉**

---

## Troubleshooting

### Problem: "Network error. Please check your connection"

**Cause**: Frontend is trying to connect to `localhost` instead of your Railway backend.

**Solution**:
1. Go to **Frontend service** → **Variables**
2. Check that `VITE_API_URL` is set correctly:
   - Should be: `https://your-backend.railway.app/api`
   - NOT: `http://localhost:3000/api`
3. If it's wrong, update it and **Redeploy** the frontend service
4. Wait for rebuild to complete (2-3 minutes)

### Problem: "502 Bad Gateway"

**Cause**: Backend service is not running or has errors.

**Solution**:
1. Go to **Backend service** → **Logs**
2. Check for error messages
3. Common issues:
   - Database connection error → Check DB variables are correct
   - Missing JWT_SECRET → Make sure it's set
   - Port error → Make sure PORT=3000 is set
4. Fix the issue and Railway will auto-redeploy

### Problem: "Can't connect to MySQL server"

**Cause**: Database variables are incorrect.

**Solution**:
1. Go to **MySQL service** → **Variables**
2. Copy the values again (they might have changed)
3. Go to **Backend service** → **Variables**
4. Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` with correct values
5. Make sure there are no extra spaces
6. Make sure `DB_HOST` doesn't have `http://` or `https://`

### Problem: "Unknown database"

**Cause**: Database name doesn't match or tables weren't created.

**Solution**:
1. Check `DB_NAME` matches `MYSQLDATABASE` from MySQL service
2. Go back to Step 7 and create the tables again
3. Make sure you used `database/schema-railway.sql` (not `schema.sql`)

### Problem: CORS Errors

**Cause**: `FRONTEND_URL` in backend doesn't match your frontend URL.

**Solution**:
1. Go to **Backend service** → **Variables**
2. Check `FRONTEND_URL` matches your frontend Railway URL exactly
3. Update if needed
4. Redeploy backend service

### Problem: Frontend shows blank page

**Cause**: Frontend build failed or not deployed.

**Solution**:
1. Go to **Frontend service** → **Logs**
2. Check for build errors
3. Go to **Frontend service** → **Deployments**
4. Check if latest deployment succeeded
5. If failed, click **"Redeploy"**

### Problem: Backend keeps restarting

**Cause**: Application error or missing environment variable.

**Solution**:
1. Go to **Backend service** → **Logs**
2. Look for error messages at the bottom
3. Common causes:
   - Missing database variables
   - Database connection failed
   - Missing JWT_SECRET
4. Fix the issue and wait for auto-redeploy

---

## Quick Reference: All Environment Variables

### Backend Service Variables

```
DB_HOST=<from MySQL service MYSQLHOST>
DB_USER=<from MySQL service MYSQLUSER>
DB_PASSWORD=<from MySQL service MYSQLPASSWORD>
DB_NAME=<from MySQL service MYSQLDATABASE>
JWT_SECRET=<your random 32+ character string>
PORT=3000
NODE_ENV=production
FRONTEND_URL=<your frontend Railway URL>
```

### Frontend Service Variables

```
VITE_API_URL=<your backend Railway URL>/api
```

---

## Final Checklist

Before considering your deployment complete, verify:

- [ ] MySQL service is running (green status)
- [ ] Backend service is running (green status)
- [ ] Frontend service is running (green status)
- [ ] All 8 backend environment variables are set
- [ ] Frontend `VITE_API_URL` is set correctly
- [ ] Database tables are created (users and prayer_records)
- [ ] Backend health endpoint works (`/health`)
- [ ] Frontend loads in browser
- [ ] Can sign up for new account
- [ ] Can log in with created account
- [ ] Can track prayers
- [ ] No errors in browser console
- [ ] No errors in Railway logs

---

## What's Next?

Once everything is working:

1. **Custom Domain** (Optional):
   - In Railway, go to your service → Settings → Domains
   - Add your custom domain
   - Update environment variables with new URLs

2. **Monitor Your App**:
   - Check Railway logs regularly
   - Monitor usage in Railway dashboard
   - Set up alerts if needed

3. **Backup Database**:
   - Railway provides automatic backups
   - Check MySQL service → Backups section

---

## Need Help?

If you're stuck:

1. Check the **Troubleshooting** section above
2. Look at Railway **Logs** for error messages
3. Verify all environment variables are set correctly
4. Make sure database tables are created
5. Test backend health endpoint first
6. Then test frontend

---

## Summary

You've successfully deployed:
- ✅ MySQL database
- ✅ Backend API service
- ✅ Frontend React application
- ✅ All environment variables configured
- ✅ Database tables created
- ✅ Application tested and working

**Congratulations! Your SalatChecker app is now live on Railway! 🎉**

---

*Last updated: This guide covers the complete Railway deployment process from scratch. Follow it step-by-step and you'll have your app running in no time!*

