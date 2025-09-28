import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';




import authRoutes from './routes/auth';
import webhookRoutes from './routes/webhooks';


dotenv.config();

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: true, // Reflects the request origin, as recommended for allowing credentials
    credentials: true
}));


app.use('/auth', authRoutes);
app.use('/webhooks', webhookRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
