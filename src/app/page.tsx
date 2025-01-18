"use client"; // Mark this as a client component

import React from 'react';
import './globals.css';
import { Timer } from './timer/timer';
import { LONG_BREAK, SHORT_BREAK, WORK } from './constants';
import WebcamStateUpdater from "./webcam/backgroundWebcam";

export type pomodoro = "work" | "shortBreak" | "longBreak";

export default function Home() {

  // const [minute, setMinute] = React.useState<number>(30);
  const [interval, setInterval] = React.useState<number>(0);
  const [pomodoro, setPomodoro] = React.useState<pomodoro>("work");
   const [sleepTracker, setSleepTracker] = React.useState<number>(0);
   const [isSleeping, setIsSleeping] = React.useState<boolean>(false);
  // interval is in seconds


  let TimerContent: React.ReactElement | null = null;

  if (pomodoro === "work") {
    // setIsPomodoro(true);
    const time = new Date();
    time.setSeconds(time.getSeconds() + WORK);
    TimerContent = (
      <div className="relative bg-gray-900">
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
      <WebcamStateUpdater setSleepTracker={setSleepTracker} sleepTracker={sleepTracker}/>
     
    </div>
  );

}
