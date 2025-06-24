import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://ephemeral-starlight-fc99d4.netlify.app',
  'https://polite-sprite-12327d.netlify.app', 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);

export default app;
