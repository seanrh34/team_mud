"use client"; // Mark this as a client component

import React, { useEffect, useRef, useState } from "react";
// import sound from "/alert.mp3";
import "./globals.css";
import { Timer } from "./timer/timer";
import { LONG_BREAK, SHORT_BREAK, SLEEPTHRESHOLD, WORK } from "./constants";
import WebcamStateUpdater from "./webcam/backgroundWebcam";
import ProgressBar from "./components/ProgressBar";
import { supabase } from "./lib/supabaseClient";
import Link from "next/link";

export type pomodoro = "work" | "shortBreak" | "longBreak";

export default function Home() {
  const [interval, setInterval] = useState<number>(0);
  const [pomodoro, setPomodoro] = useState<pomodoro>("work");
  const [sleepTracker, setSleepTracker] = useState<number>(0);
  const [isSleep, setIsSleep] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [name, setName] = useState<string>(""); // Default value is an empty string
  const [remainingTime, setRemainingTime] = useState<number>(0); // Current time left in seconds
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // Current time left in seconds
  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(true); // Show name prompt modal
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/alert.mp3");
    }
    audioRef.current.play().catch((err) => {
      console.error("Failed to play the sound:", err);
    });
  };

  const handleRemainingTimeChange = (timeLeft: number) => {
    setRemainingTime(timeLeft);
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getOriginalTime = (): number => {
    switch (pomodoro) {
      case "work":
        return WORK;
      case "shortBreak":
        return SHORT_BREAK;
      case "longBreak":
        return LONG_BREAK;
      default:
        return 0;
    }
  };

  const insertIntoLeaderboard = async (name: string, timeElapsed: number) => {
    const duration = timeElapsed;
    console.log("Sending to supabase...")
    // Insert the data into the leaderboard table
    const { data, error } = await supabase
      .from("leaderboard")
      .insert([
        {
          name,
          duration,
        },
      ]);
  
    if (error) {
      console.error("Error inserting into leaderboard:", error.message);
    } else {
      console.log("Successfully added to leaderboard:", data);
    }
  }; 

  const handleAddToLeaderboard = async () => {
    await insertIntoLeaderboard(name, timeElapsed);
  };

  useEffect(() => {
    if (sleepTracker >= SLEEPTHRESHOLD) {
      setIsSleep(true);
      if (isRunning) {
        setIsRunning(false); // This will stop the timer
      }
      setTimeElapsed(getOriginalTime() - remainingTime);
      console.log("You lasted for: ", timeElapsed);
      playSound();
    }
  });

  let TimerContent: React.ReactElement | null = null;

  if (pomodoro === "work") {
    const time = new Date();
    time.setSeconds(time.getSeconds() + WORK);
    TimerContent = (
      <div className="relative">
        <Timer
          expiryTimestamp={time}
          autoStart={false}
          pomodoro={pomodoro}
          setInterval={setInterval}
          setParentIsRunning={setIsRunning}
          onRemainingTimeChange={handleRemainingTimeChange} // Track remaining time
        />
      </div>
    );
  } else if (pomodoro === "shortBreak") {
    const time = new Date();
    time.setSeconds(time.getSeconds() + SHORT_BREAK);
    TimerContent = (
      <Timer
        expiryTimestamp={time}
        autoStart={false}
        setInterval={setInterval}
        pomodoro={pomodoro}
        setParentIsRunning={setIsRunning}
      />
    );
  } else if (pomodoro === "longBreak") {
    const time = new Date();
    time.setSeconds(time.getSeconds() + LONG_BREAK);
    TimerContent = (
      <Timer
        expiryTimestamp={time}
        autoStart={false}
        setInterval={setInterval}
        pomodoro={pomodoro}
        setParentIsRunning={setIsRunning}
      />
    );
  }

  console.log(`Sleeptracker: ${sleepTracker}`);
  console.log("isRunning: ", isRunning);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputName = e.currentTarget.elements.namedItem("name") as HTMLInputElement;
    if (inputName.value) {
      setName(inputName.value);
      setShowNamePrompt(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <WebcamStateUpdater
          setSleepTracker={setSleepTracker}
          sleepTracker={sleepTracker}
          isRunning={isRunning}
        />
      {showNamePrompt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }} // Ensure the modal has the highest stacking order
        >
          <div className="bg-gray-900 text-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Enter Your Name</h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="border bg-gray-800 border-gray-400 rounded px-3 py-2 w-full mb-6"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold">{name ? `Welcome, ${name}!` : "Welcome!"}</h1>
      <h1 className="text-xl font-semibold">Pomodoro Timer</h1>
      <span className="text-lg">Intervals Completed: {interval}</span>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setPomodoro("work")}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
        >
          Work
        </button>
        {pomodoro === "work" && !isRunning && (
          <>
            <button
              onClick={() => setPomodoro("shortBreak")}
              className="bg-yellow-700 text-white px-6 py-2 rounded hover:bg-yellow-800"
            >
              Short Break
            </button>
            <button
              onClick={() => setPomodoro("longBreak")}
              className="bg-orange-700 text-white px-6 py-2 rounded hover:bg-orange-800"
            >
              Long Break
            </button>
          </>
        )}
      </div>
      {TimerContent}
      <div className="w-full my-4 flex justify-center">
        <ProgressBar sleepTracker={sleepTracker} sleepThreshold={SLEEPTHRESHOLD} />
      </div>
      {isSleep && (
        <div className="bg-red-500 text-white p-4 mt-4 rounded shadow-md">
          Alert: Value has reached or exceeded the threshold of {SLEEPTHRESHOLD}!
          <Link href="/leaderboard">
            <button
              className="ml-4 px-4 py-2 bg-blue-500 text-white-500 rounded-lg hover:bg-blue-600"
              onClick={() => {
                setIsSleep(false);
                setSleepTracker(0);
                stopSound();
                handleAddToLeaderboard();
              }}
            >
              Submit To Leaderboard
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
