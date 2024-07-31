import express from 'express';
import cors from 'cors';
import activities from './api/runride.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/activities', activities);
app.use('*', (req, res) => {
    res.status(404).json({ error: 'not found' });
});

export default app;