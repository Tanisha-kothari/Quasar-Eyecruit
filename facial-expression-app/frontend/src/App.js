import { useState, useEffect, useRef } from "react";

export default function App() {
  const videoRef = useRef(null);
  const [emoji, setEmoji] = useState("😊");
  
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
    startCamera();
  }, []);

  async function captureAndSend() {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    try {
      const response = await fetch("http://localhost:5000/detect_emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData })
      });
      const data = await response.json();
      updateEmoji(data.emotion);
    } catch (error) {
      console.error("Error sending image:", error);
    }
  }

  function updateEmoji(emotion) {
    const emojis = {
      "Happy": "😊", "Angry": "😠", "Sad": "😢", "Surprise": "😮",
      "Fear": "😨", "Neutral": "😐", "Disgust": "🤢"
    };
    setEmoji(emojis[emotion] || "❓");
  }

  useEffect(() => {
    const interval = setInterval(captureAndSend, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/3 flex justify-center items-center">
        <video ref={videoRef} autoPlay className="border-4 border-black w-3/4 h-auto" />
      </div>
      <div className="w-1/3 flex flex-col justify-center items-center bg-white shadow-lg p-5">
        <h1 className="text-xl font-bold">Detected Emotion</h1>
        <div className="text-9xl mt-5">{emoji}</div>
      </div>
    </div>
  );
}
