# Deployment Checklist - SalatChecker

## ✅ Pre-Deployment Verification

### Frontend Changes
- [x] Full Arabic translation implemented
- [x] RTL (right-to-left) layout support
- [x] Country code selector for phone numbers
- [x] Gregorian calendar with Arabic month names
- [x] All components updated with Arabic text

### Backend Changes
- [x] Phone number validation updated for international format (+country code)
- [x] Backend accepts phone numbers with country codes (e.g., +212612345678)
- [x] JWT authentication working
- [x] All API endpoints functional

### Database
- [x] Schema updated: `phoneNumber VARCHAR(25)` to support country codes
- [x] Migration script created for existing databases

## 📋 Deployment Steps

### 1. Database Setup

**For NEW database:**
```sql
-- Run the schema file
mysql -u your_username -p < database/schema.sql
```

**For EXISTING database:**
```sql
-- Run the migration script
mysql -u your_username -p < database/migration.sql
```

### 2. Environment Variables

**Backend (`server/.env`):**
```env
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=salatchecker
JWT_SECRET=your-strong-secret-key-here
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

**Frontend (`.env` in root):**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### 3. Install Dependencies

**Backend:**
```bash
cd server
npm install --production
```

**Frontend:**
```bash
npm install
```

### 4. Build Frontend

```bash
npm run build
```

This creates the `dist` folder with production-ready files.

### 5. Deploy Files

**Backend:**
- Upload `server/` folder to your hosting
- Make sure Node.js is available on your server
- Set up PM2 or similar process manager

**Frontend:**
- Upload contents of `dist/` folder to your web root
- Configure web server to serve React app

### 6. Start Backend Server

```bash
cd server
npm start
# Or with PM2:
pm2 start index.js --name salatchecker-api
```

## 🔍 Testing Checklist

After deployment, test:

- [ ] Sign up with phone number (country code selector works)
- [ ] Sign in with phone number
- [ ] All text displays in Arabic
- [ ] Layout is RTL (right-to-left)
- [ ] Prayer tracking saves correctly
- [ ] Statistics page loads and displays data
- [ ] Dates display in Arabic (Gregorian calendar)
- [ ] Navigation works correctly
- [ ] Logout works

## ⚠️ Important Notes

1. **Phone Numbers**: All phone numbers must include country code (e.g., +212 for Morocco)
2. **Database**: If you have existing users, they may need to re-register with country codes
3. **Environment Variables**: Never commit `.env` files to version control
4. **JWT Secret**: Use a strong, random secret in production
5. **HTTPS**: Always use HTTPS in production

## 🐛 Troubleshooting

**Phone number validation errors:**
- Ensure phone numbers include country code (e.g., +212612345678)
- Check backend validation accepts international format

**Database errors:**
- Verify database connection credentials
- Check if migration script ran successfully
- Ensure `phoneNumber` column is VARCHAR(25)

**RTL layout issues:**
- Clear browser cache
- Check CSS is loading correctly

## 📞 Support

If you encounter issues:
1. Check server logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test API endpoints directly

---

## 🚀 Railway Deployment Guide (Step-by-Step)

Use these granular instructions to deploy both services (backend + frontend) on Railway using the plan outlined earlier.

### Step 1 — Verify Everything Locally
1. Install frontend deps and build:
   ```powershell
   npm install
   npm run build
   ```
2. Install backend deps:
   ```powershell
   cd server
   npm install
   cd ..
   ```
3. (Optional) Run locally with your `.env` files to sanity check:
   - Backend: `cd server && npm start`
   - Frontend: `npm run dev`

### Step 2 — Create a Railway Project & Connect Repo
1. Go to [https://railway.app](https://railway.app) and create an account.
2. Click **New Project → Deploy from GitHub**.
3. Authorize Railway to access your Git provider.
4. Select the repository that contains this project.
5. Railway clones the repo and shows it in the project dashboard.

### Step 3 — Provision the MySQL Database
1. Inside the Railway project dashboard, click **New → Database → MySQL**.
2. Wait for the database to provision.
3. Click the database service → **Connect** tab and copy:
   - Host, Port, Database, User, Password
4. Run the schema:
   - Option A: Use the **Data** tab → “Import Data” → upload `database/schema.sql`
   - Option B: Use your local MySQL client:
     ```bash
     mysql -h <HOST> -u <USER> -p -P <PORT> <database/schema.sql
     ```
   - Existing DB? Run `database/migration.sql` instead.

### Step 4 — Deploy the Backend Service
1. Click **New → Service** and choose the Git repo.
2. When prompted for the directory, set it to `server/`.
3. Railway auto-installs deps (`npm install`).
4. Set the start command to:
   ```
   npm start
   ```
5. Open the service → **Variables** tab and add:
   ```
   DB_HOST=<MySQL host>
   DB_USER=<MySQL user>
   DB_PASSWORD=<MySQL password>
   DB_NAME=<MySQL database>
   DB_PORT=<MySQL port>
   JWT_SECRET=<strong-random-string>
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://placeholder.com   # update later
   ```
6. Click **Deploy**. After deployment finishes, note the backend URL (e.g., `https://backend-production.up.railway.app`).

### Step 5 — Deploy the Frontend Service
1. Add another service from the same repo (root directory).
2. Railway detects Vite. Set:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Start command: `npm run preview -- --host 0.0.0.0 --port 8080`
3. Add env var:
   ```
   VITE_API_URL=https://<backend-subdomain>.up.railway.app/api
   ```
4. Deploy and wait for the frontend URL (e.g., `https://frontend-production.up.railway.app`).

### Step 6 — Update Backend `FRONTEND_URL`
1. Go back to the backend service → Variables.
2. Replace the placeholder `FRONTEND_URL` with the actual frontend URL from Railway.
3. Redeploy the backend service so CORS uses the correct domain.

### Step 7 — Production Testing Checklist
1. Visit the frontend URL.
2. Sign up a new test account (ensure the country code selector works).
3. Track several prayers and refresh the page; the states should persist.
4. Navigate to the Statistics page and verify data loads.
5. Hit the backend health check: `https://<backend-subdomain>.up.railway.app/health`.
6. Confirm no errors appear in Railway logs (click each service → **Logs**).

### Step 8 — (Optional) Custom Domain Setup
1. Purchase/own a domain (e.g., from Namecheap, GoDaddy).
2. In Railway frontend service → Custom Domains → add your domain (e.g., `app.yourdomain.com`).
3. Railway provides DNS records (CNAME). Add them in your DNS provider.
4. Wait for propagation; once verified, Railway issues HTTPS automatically.
5. Update variables:
   - Backend `FRONTEND_URL=https://app.yourdomain.com`
   - Frontend `VITE_API_URL=https://backend.yourdomain.com/api` (if you also mapped a custom backend domain).
6. Redeploy both services after changing env vars.

Following these steps end-to-end completes every item in the Railway deployment plan.

