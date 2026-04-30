import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
  : true;

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.get('/', (_req, res) => {
  res.send('API Century 21 funcionando.');
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);
app.use(errorHandler);

export default app;
