"use client"; // Mark this as a client component
import React, { useRef, useState, useEffect, useCallback } from "react";
// import Image from 'next/image';

interface WebcamCaptureProps {
    setSleepTracker: React.Dispatch<React.SetStateAction<number>>;
    sleepTracker : number
}



const WebcamStateUpdater :  React.FC <WebcamCaptureProps> = ({ setSleepTracker, sleepTracker}) => {

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

   
    
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const captureFrame = useCallback(async () => {
      console.log(`Capture frame called at: ${new Date().toISOString()}`); // Add this line
      try {
        console.log('enter await for stream')
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {

        console.error("Error accessing webcam:", err);
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      console.log(`videoRef ${videoRef.current} context ${context}`)

      if (!videoRef.current) return;
      if (!context) return;




      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64 string
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      console.log(`Captured image: ${imageData}`);

      // Send the captured image to the backend
      try {
        const response = await fetch('http://localhost:5001/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageData }),
        });
        const result = await response.json();
        console.log('Response received:', result);
        
        if (result.status === 1) {
          console.log('Before update, sleepTracker:', sleepTracker);
          setSleepTracker(prev => {
            console.log('Updating from:', prev);
            return prev + 1;
          });
        }
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    }, [setSleepTracker, sleepTracker]);

  
  // Function to capture a frame and send to the backend
  useEffect(() => {
    // Store ref value in a variable that persists between cleanup runs
    const videoElement = videoRef.current;
    
    // Initialize video stream
    const initWebcam = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };
  
    // Start the interval
    intervalRef.current = setInterval(captureFrame, 3000);
    
    // Initialize webcam
    initWebcam();
  
    // Cleanup function
    return () => {
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Cleanup video stream using captured ref value
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [captureFrame]);


  return <div>this is the webcam component</div>;
};

export default WebcamStateUpdater;
