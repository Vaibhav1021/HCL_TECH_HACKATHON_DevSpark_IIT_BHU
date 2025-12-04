import express from 'express';
import mongoose from 'mongoose';
import { PORT, MONGO_URI } from './config.js';
import { router } from './routes.js';
import { authMiddleware, createCorsMiddleware, loggerMiddleware } from './middleware.js';

const app = express();

app.use(express.json());
app.use(createCorsMiddleware());
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Wellness & Preventive Care API' });
});

app.use('/api', router);

// Basic protected ping for testing tokens
app.get('/api/secure-ping', authMiddleware, (req, res) => {
  res.json({ message: 'Authenticated', user: req.user });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

