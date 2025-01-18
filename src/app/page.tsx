"use client"; // Mark this as a client component

import React, { useEffect, useRef } from 'react';
import sound from "/alert.mp3";
import './globals.css';
import { Timer } from './timer/timer';
import { LONG_BREAK, SHORT_BREAK, WORK } from './constants';
import WebcamStateUpdater from "./webcam/backgroundWebcam";
import ProgressBar from "./components/ProgressBar";

export type pomodoro = "work" | "shortBreak" | "longBreak";

export default function Home() {

  // const [minute, setMinute] = React.useState<number>(30);
  const [interval, setInterval] = React.useState<number>(0);
  const [pomodoro, setPomodoro] = React.useState<pomodoro>("work");
   const [sleepTracker, setSleepTracker] = React.useState<number>(0);
   const [isSleep, setIsSleep] = React.useState<boolean>(false);

   const audioRef = useRef<HTMLAudioElement | null>(null);
  // interval is in seconds

  const sleepThreshold = 3;

  useEffect(() => {
    if (sleepTracker >= sleepThreshold) {
      setIsSleep(true);
      playSound();
    }
    else {
      setIsSleep(false);
      stopSound()

    }
  }, [sleepTracker])

  let TimerContent: React.ReactElement | null = null;

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/alert.mp3'); // Specify your sound file path
    }
    audioRef.current.play().catch((err) => {
      console.error('Failed to play the sound:', err);
    });
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop playback
      audioRef.current.currentTime = 0; // Reset to the start
    }
  };


  if (pomodoro === "work") {
    // setIsPomodoro(true);
    const time = new Date();
    time.setSeconds(time.getSeconds() + WORK);
    TimerContent = (
      <div className="relative">
        <Timer expiryTimestamp={time} autoStart={false} pomodoro = {pomodoro}setInterval = {setInterval}/>
        {/* <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold text-blue-600">Welcome to Next.js with Tailwind CSS</h1>
          <p className="mt-4 text-gray-700">This is a sample project.</p>
          <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Click Me
          </button>
        </div> */}
      </div>
    );
  }
  else if (pomodoro === "shortBreak") {
    const time = new Date();
    time.setSeconds(time.getSeconds() + SHORT_BREAK);
    TimerContent = (
    <Timer expiryTimestamp={time} autoStart={false} setInterval = {setInterval} pomodoro={pomodoro}/>
    )
  }

  else if (pomodoro === "longBreak") {
    
    const time = new Date();
    time.setSeconds(time.getSeconds() + LONG_BREAK);
    TimerContent = (
    <Timer expiryTimestamp={time} autoStart={false} setInterval = {setInterval} pomodoro={pomodoro}/>
    )
  }
  console.log(`Sleeptracker: ${sleepTracker}`);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1>Pomodoro Timer</h1>
        <span>Interval is {interval}</span>
        <div>
        <button onClick={() => {setPomodoro("work");}}>Work</button>
        
        {pomodoro === "work" && 
          <span>
          <button onClick={() => {setPomodoro("shortBreak");}}>Short Break</button>
          <button onClick={() => {setPomodoro("longBreak"); }}>Long Break</button>
          </span>
        }
        </div>
        
      {TimerContent}
      {isSleep && (
        <div className="bg-red-500 text-white p-4 mt-4 rounded">
          Alert: Value has reached or exceeded the threshold of {sleepThreshold}!
          <button 
            className="ml-4 px-4 py-2 bg-white text-red-500 rounded"
            onClick={() => {
              setIsSleep(false);
              setSleepTracker(0);
            }}
          >
            CLICK TO RESET
          </button>
        </div>
      )}
      <div className='my-4'>
        <ProgressBar sleepTracker={sleepTracker} sleepThreshold={sleepThreshold} />
      </div>
      
      <WebcamStateUpdater setSleepTracker={setSleepTracker} sleepTracker={sleepTracker}/>
      
    </div>
  );

}
