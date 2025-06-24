import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://ephemeral-starlight-fc99d4.netlify.app',
  'https://polite-sprite-12327d.netlify.app',
  'https://charming-valkyrie-effcea.netlify.app'
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Allow preflight requests from all origins
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/auth', authRoutes);

export default app;
