# SalatChecker Backend Server

Express.js backend server for the SalatChecker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=salatchecker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Make sure MySQL database is set up (run `database/schema.sql`)

4. Start the server:
```bash
npm start
# or for development
npm run dev
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "phoneNumber": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "string",
    "phoneNumber": "string"
  }
}
```

#### POST /api/auth/signin
Sign in with existing user.

**Request Body:**
```json
{
  "phoneNumber": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "string",
    "phoneNumber": "string"
  }
}
```

#### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "phoneNumber": "string"
  }
}
```

### Prayer Record Endpoints

All prayer endpoints require authentication (Bearer token in Authorization header).

#### GET /api/prayers/:date
Get prayer record for a specific date.

**Response:**
```json
{
  "date": "2024-01-15",
  "prayers": {
    "fajr": "prayed",
    "dhuhr": "not_prayed",
    "asr": "prayed",
    "maghrib": "prayed",
    "isha": "not_prayed"
  }
}
```

#### POST /api/prayers/:date
Save or update prayer record for a date.

**Request Body:**
```json
{
  "prayers": {
    "fajr": "prayed",
    "dhuhr": "not_prayed",
    "asr": "prayed",
    "maghrib": "prayed",
    "isha": "not_prayed"
  }
}
```

#### GET /api/prayers/statistics/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Get statistics for a date range.

**Response:**
```json
{
  "totalPrayed": 50,
  "totalMissed": 5,
  "totalNotPrayed": 20,
  "totalDays": 30,
  "completionPercentage": 66.67,
  "dailyBreakdown": [...]
}
```

