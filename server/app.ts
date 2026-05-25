import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { config } from './config/config';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

export { app, server };
