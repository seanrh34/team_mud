import React from 'react';
import { useTimer } from 'react-timer-hook';
import { LONG_BREAK, SHORT_BREAK, WORK } from '../constants';
import { pomodoro } from '../page';

interface TimerProps {
  expiryTimestamp: Date;
  autoStart: boolean;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  pomodoro: pomodoro;
  onRemainingTimeChange?: (remainingSeconds: number) => void; // New callback prop
}

export function TimerBreak({
  expiryTimestamp,
  autoStart,
  setInterval,
  pomodoro,
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


  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "100px" }}>
        <span>{hours} h</span> : <span>{minutes} m</span> : <span>{seconds} s</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      {isRunning ? (
        <button
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            pause();
          }}
        >
          Pause
        </button>
      ) : (
        <button
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            start();
          }}
        >
          Start
        </button>
      )}
      <button
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
          restart(time, autoStart);
        }}
      >
        Restart
      </button>
    </div>
  );
}
