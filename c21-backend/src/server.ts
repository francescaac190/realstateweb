import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
  res.send('API Century 21 funcionando.');
});

app.use('/api', routes);
app.use(errorHandler);

export default app;
