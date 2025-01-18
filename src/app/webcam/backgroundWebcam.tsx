import { useEffect, useRef, useState } from "react";

interface WebcamCaptureProps {
  setSleepTracker: React.Dispatch<React.SetStateAction<number>>;
  sleepTracker: number;
}


const WebcamStateUpdater: React.FC<WebcamCaptureProps> = ({ setSleepTracker, sleepTracker }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);


  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    console.log("init webcam!")
    //webcam stream
    const initWebcam = async():
    Promise<void> => {
      try {
        const stream = await 
        navigator.mediaDevices.getUserMedia({video: true});
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcamL ', error)
      }
    }
    initWebcam();

    return () => {
      if (videoRef.current?.srcObject)
      {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track => track.stop()))
      }
    }
  },[]);

  const captureFrame = async() => {
    // console.log("second step!")
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d');
    if (!context) return
  

  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  context.drawImage(videoRef.current,0,0,canvas.width, canvas.height)

  const imageData = canvas.toDataURL('image/jpeg');
  setCapturedImage(imageData);

  const response = await(fetch('http://localhost:5001/predict', {
    method : 'POST', 
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({image: imageData}),
  }));
  
  const result = await response.json();
  // console.log(result.status);

  if (result.status === 1){
    setSleepTracker(curSleepTracker => {return curSleepTracker + 1})
  }
  else if (result.status === 0){
    setSleepTracker(curSleepTracker => {
      return curSleepTracker > 0 ? curSleepTracker -1 : curSleepTracker
    })
  }
  };


  useEffect(() => {
    // console.log("first step!")
    const intervalId = setInterval(
      captureFrame,1000);
    return () => clearInterval(intervalId);

  })
  return <video ref={videoRef} width="640" height="480" autoPlay style={{ display: 'none' }}></video>;
}

export default WebcamStateUpdater;