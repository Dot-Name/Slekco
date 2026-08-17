// import 'dotenv/config';
// import path from 'path';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import { connectDB } from './config/db.js';
// import routes from './routes/index.js';
// import { notFound, errorHandler } from './middleware/error.js';

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
// app.use(express.json({ limit: '1mb' }));
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

// // Uploaded product images are served straight from disk.
// app.use('/uploads', express.static(path.resolve('uploads'), { maxAge: '7d' }));

// app.get('/health', (req, res) => res.json({ success: true, uptime: process.uptime() }));
// app.use('/api', routes);

// app.use(notFound);
// app.use(errorHandler);

// connectDB()
//   .then(() => app.listen(PORT, () => console.log(`Slekco API listening on http://localhost:${PORT}`)))
//   .catch((err) => {
//     console.error('Database connection failed:', err.message);
//     process.exit(1);
//   });


import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || '*',
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
);

app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Uploaded product images
app.use(
  '/uploads',
  express.static(path.resolve('uploads'), {
    maxAge: '7d'
  })
);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Slekco Marketplace API is running'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Slekco API listening on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });