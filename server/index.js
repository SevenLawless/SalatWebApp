import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import prayerRoutes from './routes/prayers.js';

dotenv.config();

const app = express();
// Railway automatically sets PORT - don't override it
const PORT = process.env.PORT || 3000;

// Log the port being used
console.log(`🔧 Starting server on port: ${PORT}`);
console.log(`🔧 PORT environment variable: ${process.env.PORT || 'not set (using default 3000)'}`);

// Middleware
// CORS configuration - allow multiple origins for production
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      // In development, allow localhost
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - MUST be before all other routes
// This ensures it works even if routes fail to load
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  try {
    const response = { 
      status: 'ok', 
      message: 'SalatChecker API is running',
      timestamp: new Date().toISOString(),
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    };
    console.log('✅ Sending health check response');
    res.json(response);
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Routes - wrap in try-catch to prevent crashes
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/prayers', prayerRoutes);
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error);
  // Don't exit - let health endpoint still work
}

// Error handling middleware - must be before 404 handler
app.use((err, req, res, next) => {
  console.error('❌ Request error:', err.message);
  console.error('❌ Error stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Database: ${process.env.DB_HOST || 'not configured'}`);
  console.log(`✅ Server is ready to accept connections`);
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Log when server is actually listening
server.on('listening', () => {
  const addr = server.address();
  console.log(`✅ Server listening on ${addr.address}:${addr.port}`);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

