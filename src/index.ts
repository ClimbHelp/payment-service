import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/env';
import logger from './config/logger';
import paymentRoutes from './routes/payment.routes';

const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: config.security.corsOrigin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
    },
  },
});
app.use(limiter);

// Middleware pour les webhooks Stripe (raw body)
app.use('/api/payments/webhooks', express.raw({ type: 'application/json' }));

// Middleware pour parser le JSON (toutes les autres routes)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/payments/webhooks')) {
    next(); // ne pas parser en JSON pour les webhooks
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

// Routes
app.use('/api/payments', paymentRoutes);

// Route de santé
app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Payment service is running',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// Route par défaut
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Payment Service API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      payments: '/api/payments',
    },
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// Démarrage du serveur
const PORT = config.server.port;

app.listen(PORT, () => {
  logger.info(`Payment service started on port ${PORT}`, {
    port: PORT,
    environment: config.server.nodeEnv,
  });
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 