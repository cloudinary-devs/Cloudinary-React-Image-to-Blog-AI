import { useState } from 'react';
import './App.css';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

function App() {
  const [image, setImage] = useState(null);

  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUD_NAME
    }
  });

  const uwConfig = {
    cloudName: import.meta.env.VITE_CLOUD_NAME,
    uploadPreset: "ai-demo",
    sources: ["local"],
    multiple: false,
  };

  return (
    <div>
      {image && 
        <div className="image">
          <AdvancedImage cldImg={cld.image(image.public_id).resize(fill().width(500).height(500).gravity(focusOn(FocusOn.faces())))} className="full-image"/>
        </div>
      }
      <CloudinaryUploadWidget uwConfig={uwConfig} setImage={setImage}/>
    </div>
  );
}

export default App;
