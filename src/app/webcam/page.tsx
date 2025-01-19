"use client"; // Mark this as a client component
import React, { useRef, useState, useEffect } from "react";
import Image from 'next/image';

const WebcamCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        // Get webcam stream
        const initWebcam = async (): Promise<void> => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        initWebcam();

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);


  // Function to capture a frame and send to the backend
  const captureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 string
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);

    // Send the captured image to the backend
    const response = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });

    const result = await response.json();
    console.log(result);
  };

  useEffect(() => {
    const intervalId = setInterval(captureFrame, 1000); // Capture frame every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <button onClick={captureFrame}>Capture Frame</button>
      {capturedImage && (
        <Image
          src={capturedImage}
          alt="Captured frame"
          width={videoRef.current?.videoWidth || 0}
          height={videoRef.current?.videoHeight || 0}
        />
      )}
    </div>
  );
};

export default WebcamCapture;
