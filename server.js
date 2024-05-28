/* eslint-disable no-undef */
import 'dotenv/config.js';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const port = 3000;

// Configure Cloudinary with secure URLs and credentials
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define a GET endpoint
app.get('/caption', async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload('island.png', { detection: 'captioning' });
    console.log(result.info.detection.captioning);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
