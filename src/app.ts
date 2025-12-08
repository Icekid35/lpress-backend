import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
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
    origin: '*',
    credentials: false,
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
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'LPRES Admin API Documentation',
  })
);

// API Routes
app.use(`/api/${config.apiVersion}`, routes);

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'LPRES Admin API is running',
    version: config.apiVersion,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Root Route - Professional Landing Page
app.get('/', (_req: Request, res: Response) => {
  try {
    const htmlPath = path.join(__dirname, 'views', 'landing.html');

    if (!fs.existsSync(htmlPath)) {
      console.error('Landing page not found at:', htmlPath);
      console.error('__dirname:', __dirname);
      console.error('Directory contents:', fs.readdirSync(__dirname));
    }

    let html = fs.readFileSync(htmlPath, 'utf-8');

    html = html.replace(/{{API_VERSION}}/g, config.apiVersion);
    html = html.replace(/{{ENVIRONMENT}}/g, config.nodeEnv);

    res.send(html);
  } catch (error) {
    console.error('Error loading landing page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load landing page',
      error: config.nodeEnv === 'development' ? error : undefined,
    });
  }
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
