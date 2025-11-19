# Salat Checker - Islamic Prayer Tracker

A modern, production-ready web application for tracking daily Islamic prayers (Salat) with statistics and prayer time display. Built with React, Node.js, Express, and MySQL.

## Features

- **Secure Authentication**: Sign up and sign in with phone number and password
- **Daily Prayer Tracking**: Track 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **Prayer Times**: Automatically fetch and display prayer times based on your location
- **Statistics Dashboard**: View prayer statistics for custom date ranges
- **Modern UI**: Beautiful, clean, minimal, and elegant design
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production Ready**: Fully configured for deployment on Hostinger or similar hosting

## Technology Stack

### Frontend
- React 18
- Vite
- React Router
- Modern CSS with gradients and animations

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SalatChecker1
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Set up the database**
   - Create a MySQL database
   - Run the schema file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **Configure environment variables**

   Create `server/.env` file:
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

   Create `.env` file in root (for frontend):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Running the Application

1. **Start the backend server**
```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

2. **Start the frontend development server** (in a new terminal)
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. **Build the frontend**
```bash
npm run build
```

2. **The built files will be in the `dist` directory**

3. **For production, set environment variables appropriately:**
   - Set `NODE_ENV=production`
   - Update `FRONTEND_URL` to your production domain
   - Use a strong `JWT_SECRET`
   - Configure production database credentials

## Deployment to Hostinger

### Backend Deployment

1. Upload the `server` directory to your Hostinger hosting
2. Set up environment variables in your hosting control panel
3. Install dependencies: `npm install --production`
4. Start the server using PM2 or similar process manager:
   ```bash
   pm2 start server/index.js --name salatchecker-api
   ```

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Upload the `dist` folder contents to your web root
3. Configure your web server to serve the React app
4. Update `VITE_API_URL` in your build to point to your backend API

### Database Setup

1. Create a MySQL database in your Hostinger control panel
2. Import the schema: `mysql -u username -p database_name < database/schema.sql`
3. Update database credentials in `server/.env`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Prayer Records
- `GET /api/prayers/:date` - Get prayer record for date (protected)
- `POST /api/prayers/:date` - Save/update prayer record (protected)
- `GET /api/prayers/statistics/range?startDate=&endDate=` - Get statistics (protected)

## Project Structure

```
SalatChecker1/
├── src/
│   ├── components/
│   │   ├── SignUp.jsx
│   │   ├── SignIn.jsx
│   │   ├── PrayerTracker.jsx
│   │   ├── PrayerCard.jsx
│   │   ├── Statistics.jsx
│   │   └── Navbar.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/
│   │   └── prayerTimes.js
│   ├── styles/
│   │   └── App.css
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── user.js
│   │   └── prayerRecord.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── prayers.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
├── database/
│   └── schema.sql
├── package.json
└── vite.config.js
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- SQL injection protection (parameterized queries)

## Usage

1. **Sign Up**: Create a new account with username, phone number, and password
2. **Sign In**: Login with your phone number and password
3. **Track Prayers**: Check off each prayer as you complete it throughout the day
4. **View Statistics**: Navigate to the Statistics page to see your prayer history and completion rates

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
