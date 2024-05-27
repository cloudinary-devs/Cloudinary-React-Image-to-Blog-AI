import { useCallback, useEffect, useState } from "react";
interface CloudinaryUploadWidgetProps {
  uwConfig: {
    cloudName: string,
    uploadPreset: string,
    sources: string[],
    multiple: boolean,
    folder?: string,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setImage: any | unknown;
}

function CloudinaryUploadWidget({ uwConfig, setImage }: CloudinaryUploadWidgetProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  const processUploads = useCallback((error: unknown, result: unknown) => {
    if(result.event === "success") {
      console.log(result.info)
      setImage(result.info);
    }
  }, []);

  const initializeCloudinaryWidget = async () => {
    if (loaded) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).cloudinary.openUploadWidget(uwConfig, processUploads);
      } catch (error) {
        console.error(error)
      }
    }
  };

  return (
    <div className="app">
      <button id="upload_widget" onClick={initializeCloudinaryWidget}>
        Upload Images
      </button>
    </div>
  );
}

export default CloudinaryUploadWidget;