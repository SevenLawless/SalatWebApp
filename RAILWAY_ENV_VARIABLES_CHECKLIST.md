# Railway Environment Variables - Copy & Paste Checklist

## ✅ Step-by-Step Checklist

### Part 1: Set Up MySQL Database

- [ ] **Add MySQL service** in Railway:
  - Click "+ New" → "Database" → "Add MySQL"
  - Wait 1-2 minutes for it to be ready

- [ ] **Open MySQL service** → Click "Variables" tab
- [ ] **Copy these 4 values** (click each to reveal):
  - [ ] `MYSQLHOST` = `___________________________` (copy this)
  - [ ] `MYSQLUSER` = `___________________________` (copy this)
  - [ ] `MYSQLPASSWORD` = `___________________________` (copy this)
  - [ ] `MYSQLDATABASE` = `___________________________` (copy this)

- [ ] **Create database tables**:
  - In MySQL service → "Data" or "Query" tab
  - Open MySQL console
  - Copy all SQL from `database/schema.sql` file
  - Paste and run it

---

### Part 2: Backend Service Environment Variables

Go to your **Backend service** → **Variables** tab → Click **"+ New Variable"** for each:

#### Database Variables (copy from MySQL service above)

- [ ] **Variable**: `DB_HOST`
  - **Value**: `___________________________` (paste MYSQLHOST value here)

- [ ] **Variable**: `DB_USER`
  - **Value**: `___________________________` (paste MYSQLUSER value here)

- [ ] **Variable**: `DB_PASSWORD`
  - **Value**: `___________________________` (paste MYSQLPASSWORD value here)

- [ ] **Variable**: `DB_NAME`
  - **Value**: `___________________________` (paste MYSQLDATABASE value here)

#### Other Backend Variables

- [ ] **Variable**: `JWT_SECRET`
  - **Value**: `your-super-secret-jwt-key-minimum-32-characters-long`
  - ⚠️ Create your own random string (at least 32 characters)

- [ ] **Variable**: `PORT`
  - **Value**: `3000`

- [ ] **Variable**: `NODE_ENV`
  - **Value**: `production`

- [ ] **Variable**: `FRONTEND_URL`
  - **Value**: `https://your-frontend-service.railway.app`
  - ⚠️ Replace with your actual frontend Railway URL (get it after deploying frontend)

---

### Part 3: Frontend Service Environment Variables

Go to your **Frontend service** → **Variables** tab → Click **"+ New Variable"**:

- [ ] **Variable**: `VITE_API_URL`
  - **Value**: `https://your-backend-service.railway.app/api`
  - ⚠️ Replace `your-backend-service.railway.app` with your actual backend Railway URL

---

## 📋 Quick Copy-Paste Template

After you have all the values, here's the format:

### Backend Service Variables:
```
DB_HOST=<paste MYSQLHOST here>
DB_USER=<paste MYSQLUSER here>
DB_PASSWORD=<paste MYSQLPASSWORD here>
DB_NAME=<paste MYSQLDATABASE here>
JWT_SECRET=<create your own 32+ char secret>
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
```

### Frontend Service Variables:
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🔍 Where to Find Your Service URLs

1. **Backend URL**: 
   - Go to Backend service → Settings → Generate Domain
   - Copy the URL (e.g., `https://salatchecker-backend-production.up.railway.app`)

2. **Frontend URL**: 
   - Go to Frontend service → Settings → Generate Domain
   - Copy the URL (e.g., `https://salatchecker-frontend-production.up.railway.app`)

---

## ⚠️ Important Notes

1. **MySQL variables vs Backend variables**:
   - MySQL service has: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
   - Backend service needs: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - You COPY the VALUES from MySQL service and use them in Backend service

2. **Order matters**:
   - Set up MySQL first
   - Set backend variables
   - Deploy backend
   - Get backend URL
   - Set frontend `VITE_API_URL` with backend URL
   - Deploy frontend
   - Get frontend URL
   - Update backend `FRONTEND_URL` with frontend URL
   - Redeploy backend

3. **After changing variables**:
   - Railway will auto-redeploy
   - Wait for deployment to complete
   - Check logs if there are errors

---

## 🆘 Still Need Help?

See `RAILWAY_MYSQL_SETUP.md` for detailed instructions with screenshots guidance.

