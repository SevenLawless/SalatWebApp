# How to Set Up MySQL Database in Railway

## Step 1: Add MySQL Service to Your Railway Project

1. Go to your Railway project dashboard
2. Click **"+ New"** button (top right)
3. Select **"Database"** → **"Add MySQL"**
4. Railway will automatically create a MySQL database for you
5. Wait for it to provision (takes 1-2 minutes)

## Step 2: Find Your MySQL Credentials

Once the MySQL service is created:

1. **Click on the MySQL service** in your Railway project
2. Go to the **"Variables"** tab
3. You'll see Railway automatically created these variables:
   - `MYSQLHOST` - This is your DB_HOST
   - `MYSQLUSER` - This is your DB_USER
   - `MYSQLPASSWORD` - This is your DB_PASSWORD
   - `MYSQLPORT` - Usually 3306 (you don't need this)
   - `MYSQLDATABASE` - This is your DB_NAME

## Step 3: Copy the Values

**Click on each variable** to reveal its value, then copy them:

- `MYSQLHOST` → Copy this value (e.g., `containers-us-west-123.railway.app`)
- `MYSQLUSER` → Copy this value (usually `root`)
- `MYSQLPASSWORD` → Copy this value (a long random string)
- `MYSQLDATABASE` → Copy this value (usually `railway`)

## Step 4: Set Environment Variables in Your Backend Service

1. Go to your **Backend service** (not the MySQL service)
2. Click on **"Variables"** tab
3. Click **"+ New Variable"** for each one:

### Add These Variables:

| Variable Name | Value (from MySQL service) | Example |
|--------------|---------------------------|---------|
| `DB_HOST` | Copy value from `MYSQLHOST` | `containers-us-west-123.railway.app` |
| `DB_USER` | Copy value from `MYSQLUSER` | `root` |
| `DB_PASSWORD` | Copy value from `MYSQLPASSWORD` | `AbCdEf123456...` |
| `DB_NAME` | Copy value from `MYSQLDATABASE` | `railway` |
| `JWT_SECRET` | Create your own (min 32 characters) | `my-super-secret-jwt-key-123456789012` |
| `PORT` | `3000` | `3000` |
| `NODE_ENV` | `production` | `production` |
| `FRONTEND_URL` | Your frontend Railway URL | `https://your-frontend.railway.app` |

## Step 5: Create Your Database Tables

After setting the variables, you need to create the database tables:

### Option A: Using Railway's MySQL Console (Easiest)

1. Go to your **MySQL service** in Railway
2. Click on **"Data"** tab (or **"Query"** tab)
3. Click **"Open MySQL Console"** or **"Connect"**
4. **Important**: Railway creates a database for you (usually named `railway`). You have two options:

   **Option 1: Use Railway's default database** (Easier - Recommended)
   - Use the file `database/schema-railway.sql` (already prepared for you)
   - Copy the entire contents of `database/schema-railway.sql`
   - Paste and run it
   - This creates the tables in Railway's default database

   **Option 2: Create your own database**
   - Use the full `database/schema.sql` file
   - But make sure `DB_NAME` in your backend variables matches the database name you create

5. Click **"Run"** or **"Execute"**

### Option B: Using Railway CLI

If you have Railway CLI installed:
```bash
railway connect mysql
mysql -u $MYSQLUSER -p$MYSQLPASSWORD -h $MYSQLHOST $MYSQLDATABASE < database/schema.sql
```

### Option C: Using a MySQL Client

1. Get your connection details from Railway MySQL service Variables
2. Use a tool like MySQL Workbench, DBeaver, or TablePlus
3. Connect using:
   - Host: `MYSQLHOST` value
   - Port: `3306`
   - User: `MYSQLUSER` value
   - Password: `MYSQLPASSWORD` value
   - Database: `MYSQLDATABASE` value
4. Run the SQL from `database/schema.sql`

## Quick Reference: Exact Variable Names

**In Backend Service Variables, add:**

```
DB_HOST=<value from MYSQLHOST>
DB_USER=<value from MYSQLUSER>
DB_PASSWORD=<value from MYSQLPASSWORD>
DB_NAME=<value from MYSQLDATABASE>
JWT_SECRET=your-random-secret-key-minimum-32-characters-long
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-service.railway.app
```

## Important Notes

⚠️ **Don't confuse the MySQL service variables with your backend service variables!**

- **MySQL service** has: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
- **Backend service** needs: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

You copy the values from MySQL service and use them in Backend service with different names!

## Troubleshooting

### "Can't connect to MySQL server"
- ✅ Make sure you copied the values correctly (no extra spaces)
- ✅ Check that `DB_HOST` doesn't include `http://` or `https://`
- ✅ Verify all 4 database variables are set in Backend service

### "Unknown database"
- ✅ Make sure `DB_NAME` matches the `MYSQLDATABASE` value exactly
- ✅ Check that you've run the schema.sql to create tables

### "Access denied"
- ✅ Double-check `DB_USER` and `DB_PASSWORD` are correct
- ✅ Make sure you copied from the MySQL service, not made up values

