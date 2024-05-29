import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary } from '@cloudinary/url-gen';
import ReactMarkdown from 'react-markdown';
import AudioPlayer from './AudioPlayer';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
  }, [shouldSubmit, image]);

  const handleImageChange = (e) => {
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
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/caption', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaption(response.data.caption);
      setStory(response.data.story.content);
      const myImage = cld.image(response.data.public_id); 

      // Resize to 250 x 250 pixels using the 'fill' crop mode.
      myImage.resize(fill().width(500).height(500));
      setImage(myImage);
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
      {loading && <div className="spinner"></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && !loading && <AdvancedImage cldImg={image} alt={caption} />}
      {story && (
        <div>
          <AudioPlayer text={story} setLoading={setLoading}/>
          {!loading && <ReactMarkdown>{story}</ReactMarkdown>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;