import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { LONG_BREAK, SHORT_BREAK, WORK } from '../constants';
import { pomodoro } from '../page';

interface TimerProps {
  expiryTimestamp: Date;
  autoStart: boolean;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  pomodoro: pomodoro;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setSleepTracker : React.Dispatch<React.SetStateAction<number>>;
  onRemainingTimeChange?: (remainingSeconds: number) => void; // New callback prop
  isSleep: boolean;
}

export function Timer({
  expiryTimestamp,
  autoStart,
  setInterval,
  pomodoro,
  setIsRunning,
  setSleepTracker,
  onRemainingTimeChange, // Destructure new prop to track the elapsed time
  isSleep
}: TimerProps) {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    restart,
  } = useTimer({
    expiryTimestamp,
    autoStart,
    onExpire: () => {
      console.warn("timer expired!");
      setInterval((prevInterval) => {
        return pomodoro === "work" ? prevInterval + 1 : prevInterval;
      });
      const time = new Date();
      const addTime =
        pomodoro === "work"
          ? WORK
          : pomodoro === "longBreak"
          ? LONG_BREAK
          : pomodoro === "shortBreak"
          ? SHORT_BREAK
          : 0;
      time.setSeconds(time.getSeconds() + addTime);
      restart(time, autoStart);
    },
  });

  // Notify parent of the remaining time in seconds
  useEffect(() => {
    if (onRemainingTimeChange) {
      const totalRemainingSeconds = hours * 3600 + minutes * 60 + seconds;
      onRemainingTimeChange(totalRemainingSeconds);
    }
  }, [seconds, minutes, hours, onRemainingTimeChange]);

  useEffect(() => {
    setIsRunning(isRunning);
  }, [isRunning, setIsRunning]);

  useEffect(() => {
    if (isSleep) {
      pause();
    }
  }, [isSleep, pause]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{hours} h</span> : <span>{minutes} m</span> : <span>{seconds} s</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      {isRunning && !isSleep ? (
        <button
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            pause();
            setIsRunning(false);
            setSleepTracker(0); //resets doze counter
          }}
        >
          Pause
        </button>
      ) : !isSleep ? (
        <button
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            start();
            setIsRunning(true);
          }}
        >
          Start
        </button>
      ) : null}
      {!isSleep && <button
        className="m-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => {
          const time = new Date();
          const addTime =
            pomodoro === "work"
              ? WORK
              : pomodoro === "longBreak"
              ? LONG_BREAK
              : pomodoro === "shortBreak"
              ? SHORT_BREAK
              : 0;
          time.setSeconds(time.getSeconds() + addTime);
          console.log(time, minutes * 60);
          setIsRunning(false);
          setSleepTracker(0); //resets doze counter
          restart(time, autoStart);
        }}
      >
        Restart
      </button>}
    </div>
  );
}
