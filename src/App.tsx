import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary } from '@cloudinary/url-gen/index';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'ai-devx-demo'
    }
  });


  useEffect(() => {
    if (shouldSubmit && image) {
      handleSubmit();
    }
  }, [shouldSubmit]);

  const handleImageChange = async (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0] !== null) {
      setImage(e.target.files[0]);
      setShouldSubmit(true);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image to upload');
      setShouldSubmit(false);
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
      const myImage = cld.image(response.data.public_id); 

      // Resize to 250 x 250 pixels using the 'fill' crop mode.
       myImage.resize(fill().width(500).height(500));
      setImage(myImage)
      setError(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image: ' + error.message);
    } finally {
      setShouldSubmit(false);
    }
  };

  return (
    <div className="app">
      <h1>Image to Blog AI</h1>
      <form onSubmit={(e) => e.preventDefault()}>
      <label className="custom-file-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          Choose File
        </label>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AdvancedImage cldImg={image} alt={caption}/>
      {caption && <p>{caption}</p>}
    </div>
  );
};

export default ImageUpload;
