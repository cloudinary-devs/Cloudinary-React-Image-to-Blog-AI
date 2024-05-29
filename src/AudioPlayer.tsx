import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";

interface AudioPlayerProps {
  text: string;
  setLoading: (loading: boolean) => void;
}

const AudioPlayer = ({ text, setLoading }: AudioPlayerProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const previousTextRef = useRef<string | null>(null);

  useEffect(() => {
    const generateAudio = async (text: string) => {
        console.log('here')
      try {
        const response = await fetch("/api/generate-audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
          }),
        });

        if (!response.ok) {
          throw new Error("Error generating audio");
        }

        const data = await response.json();
        setAudioUrl(data.audioUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error generating audio:", error);
        setLoading(false);
      }
    };

    if (previousTextRef.current !== text) {
        previousTextRef.current = text;
        generateAudio(text);
    }
  }, [setLoading, text]);

  return <div>{audioUrl && <ReactPlayer width="100%" height="100%" url={audioUrl} controls />}</div>;
};

export default AudioPlayer;
