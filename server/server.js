const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/locations');
const orderRoutes = require('./routes/orders');
const inquiryRoutes = require('./routes/inquiries');

// Import database
const { db } = require('./config/database');

const app = express();
// Optional middlewares (use if installed)
let compression; try { compression = require('compression'); } catch (e) { compression = null; }
let morgan; try { morgan = require('morgan'); } catch (e) { morgan = null; }
const PORT = process.env.PORT || 8080;

// Enforce critical env in production
if ((process.env.NODE_ENV || '').toLowerCase() === 'production' && !process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET must be set in production.');
    process.exit(1);
}

// Security middleware
if (morgan) {
    app.use(morgan((process.env.NODE_ENV || 'development') === 'production' ? 'combined' : 'dev'));
}
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

if (compression) {
    app.use(compression());
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
    }
});

const otpLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: parseInt(process.env.OTP_RATE_LIMIT_MAX || '3', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'تعداد درخواست‌های OTP بیش از حد مجاز است. لطفاً یک دقیقه صبر کنید.'
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '50', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'تلاش بیش از حد برای ورود. لطفاً بعداً تلاش کنید.'
    }
});

// CORS configuration (env-driven)
const corsOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // e.g., curl/postman
        if (corsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS blocked for origin: ' + origin), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
}));

// Body parsing middleware
const BODY_LIMIT = process.env.BODY_LIMIT || '10mb';
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_LIMIT }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api/auth/admin/login', loginLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bil Flow Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Static files for uploaded images
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'مسیر یافت نشد'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    // Handle specific error types
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'فرمت JSON نامعتبر است'
        });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'حجم فایل بیش از حد مجاز است'
        });
    }
    
    // Default error response
    res.status(500).json({
        success: false,
        message: 'خطای داخلی سرور'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Bil Flow Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
