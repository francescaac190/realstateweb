import express from 'express';
import cors from 'cors';
 import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API Century 21 funcionando ✅');
});

export default app;
