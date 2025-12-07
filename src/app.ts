import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'LPRES Admin API Documentation',
}));

// API Routes
app.use(`/api/${config.apiVersion}`, routes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'LPRES Admin API is running',
    version: config.apiVersion,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to LPRES Admin API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
    endpoints: {
      projects: `/api/${config.apiVersion}/projects`,
      news: `/api/${config.apiVersion}/news`,
      complaints: `/api/${config.apiVersion}/complaints`,
      subscribers: `/api/${config.apiVersion}/subscribers`,
    },
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error Handler
app.use(errorHandler);

export default app;
