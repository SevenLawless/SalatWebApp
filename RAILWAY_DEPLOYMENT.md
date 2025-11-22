# Railway Deployment Guide

This guide will help you deploy SalatChecker to Railway with both frontend and backend services.

## Prerequisites

- Railway account (sign up at https://railway.app)
- GitHub repository with your code
- MySQL database (can be Railway's MySQL service or external)

## Deployment Steps

### 1. Deploy Backend Service

1. **Create a new Railway project** from your GitHub repository
2. **Add a new service** and select "Deploy from GitHub repo"
3. **Configure the service:**
   - **Root Directory**: Set to `server`
   - **Start Command**: `npm start`
   - **Build Command**: (leave empty or `npm install`)

4. **Set Environment Variables** in Railway dashboard:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=salatchecker
   JWT_SECRET=your-strong-secret-key-here-min-32-chars
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.railway.app
   ```

5. **Generate Railway URL** for your backend:
   - Railway will provide a URL like: `https://your-backend-service.railway.app`
   - **Copy this URL** - you'll need it for the frontend

### 2. Deploy Frontend Service

1. **Add another service** in the same Railway project
2. **Configure the service:**
   - **Root Directory**: Set to `.` (root of repo)
   - **Start Command**: `npm run preview` (or use a static file server)
   - **Build Command**: `npm install && npm run build`

3. **Set Environment Variables** in Railway dashboard:
   ```
   VITE_API_URL=https://your-backend-service.railway.app/api
   ```
   ⚠️ **IMPORTANT**: This must be set BEFORE building. Railway will use this during the build process.

4. **Alternative: Use Static File Serving**
   - Railway can serve static files from the `dist` folder
   - You may need to add a `railway.json` or configure the service to serve static files
   - Or use a simple Node.js server to serve the built files

### 3. Database Setup

**📖 See `RAILWAY_MYSQL_SETUP.md` for detailed step-by-step instructions!**

Quick steps:
1. **Add MySQL service** in Railway:
   - Click "+ New" → "Database" → "Add MySQL"
   - Wait for it to provision

2. **Get MySQL credentials**:
   - Click on MySQL service → "Variables" tab
   - You'll see: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
   - Copy these values

3. **Set in Backend service**:
   - Go to Backend service → "Variables"
   - Add these variables (copy values from MySQL service):
     - `DB_HOST` = value from `MYSQLHOST`
     - `DB_USER` = value from `MYSQLUSER`
     - `DB_PASSWORD` = value from `MYSQLPASSWORD`
     - `DB_NAME` = value from `MYSQLDATABASE`

4. **Create database tables**:
   - Go to MySQL service → "Data" or "Query" tab
   - Open MySQL console
   - Copy/paste contents of `database/schema.sql`
   - Run it

### 4. Configure Domains (Optional)

1. **Backend**: Generate a custom domain or use Railway's provided domain
2. **Frontend**: Generate a custom domain or use Railway's provided domain
3. **Update environment variables**:
   - Backend: Update `FRONTEND_URL` with your frontend domain
   - Frontend: Update `VITE_API_URL` with your backend domain + `/api`

## Important Notes

### Environment Variables Timing

- **VITE_API_URL** must be set BEFORE building the frontend
- If you change `VITE_API_URL` after building, you need to rebuild
- Railway will rebuild automatically when you change environment variables

### CORS Configuration

The backend is configured to accept requests from:
- The URL specified in `FRONTEND_URL` environment variable
- Multiple URLs if comma-separated (e.g., `https://app1.com,https://app2.com`)
- Localhost in development mode

### Troubleshooting

#### "Network error. Please check your connection" or "ERR_CONNECTION_REFUSED"
**This is the most common issue!** It means the frontend is trying to connect to `localhost:3000` instead of your Railway backend.

**Solution:**
1. ✅ Go to your **Frontend service** in Railway dashboard
2. ✅ Click on **Variables** tab
3. ✅ Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-service.railway.app/api`
   - ⚠️ **Important**: Replace `your-backend-service` with your actual backend Railway URL
4. ✅ **Redeploy the frontend service** (Railway will rebuild automatically)
5. ✅ Wait for the build to complete
6. ✅ Test again

**How to find your backend URL:**
- Go to your Backend service in Railway
- Click on **Settings** → **Generate Domain**
- Copy the URL (e.g., `https://salatchecker-backend-production.up.railway.app`)
- Use this URL + `/api` for `VITE_API_URL`

#### "502 Bad Gateway"
- ✅ Check backend service is running (go to Backend service → Logs)
- ✅ Verify database connection (check DB environment variables)
- ✅ Check backend logs in Railway dashboard for errors
- ✅ Ensure `PORT` environment variable is set (Railway sets this automatically, but you can set it to `3000`)

#### CORS Errors
- ✅ Check that `FRONTEND_URL` in backend matches your frontend Railway URL
- ✅ Go to Backend service → Variables
- ✅ Set `FRONTEND_URL` to your frontend service URL (e.g., `https://salatchecker-frontend-production.up.railway.app`)
- ✅ Redeploy backend service

### Quick Checklist

- [ ] Backend service deployed and running
- [ ] Backend environment variables set (DB, JWT_SECRET, FRONTEND_URL)
- [ ] Database schema imported
- [ ] Frontend `VITE_API_URL` set to backend URL + `/api`
- [ ] Frontend service built and deployed
- [ ] Both services have accessible URLs
- [ ] CORS configured correctly
- [ ] Test signup/login functionality

## Example Environment Variables

### Backend Service
```env
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://salatchecker-frontend.railway.app
```

### Frontend Service
```env
VITE_API_URL=https://salatchecker-backend.railway.app/api
```

## Alternative: Single Service Deployment

If you want to deploy both frontend and backend in one service:

1. Build frontend: `npm run build`
2. Serve static files from `dist` folder using Express
3. Update `server/index.js` to serve static files in production
4. Deploy only the `server` directory

This approach requires modifying the server to serve the frontend build files.

