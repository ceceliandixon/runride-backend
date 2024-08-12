import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './api/runride.route.js';

// Setup multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/assets')); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage });

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the "public/assets" directory
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Use multer middleware where necessary (e.g., in specific routes)
app.post('/upload', upload.single('picture'), (req, res) => {
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

app.use('/api/v1/', routes);
app.use('*', (req, res) => {
    res.status(404).json({ error: 'not found' });
});

export default app;