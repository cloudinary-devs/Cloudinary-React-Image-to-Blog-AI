import { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3000/caption', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaption(response.data.info.detection.captioning.data.caption);
      setError(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {caption && <p>Caption: {caption}</p>}
    </div>
  );
};

export default ImageUpload;
