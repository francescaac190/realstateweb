import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API Century 21 funcionando.');
});

app.use('/api', routes);
app.use(errorHandler);

export default app;
