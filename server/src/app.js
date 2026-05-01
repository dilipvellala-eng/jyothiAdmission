import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './docs/swagger.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import classRoutes from './routes/class.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
morgan.token('safe-url', (req) => req.originalUrl.split('?')[0]);
app.use(morgan(':remote-addr - :method :safe-url :status :res[content-length] - :response-time ms'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'school-admission-api' }));
app.use('/public', express.static(path.resolve(__dirname, '..', 'public')));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
