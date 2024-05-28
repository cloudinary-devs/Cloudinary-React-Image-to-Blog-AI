/* eslint-disable no-undef */
import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Configure Cloudinary with secure URLs and credentials
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a POST endpoint to handle image upload
app.post('/caption', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { detection: 'captioning' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ error: error.message });
      }
      console.log('Caption generated:', result.info.detection.captioning);
      res.json(result);
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
