import React from 'react';
import { useTimer } from 'react-timer-hook';
import { LONG_BREAK, SHORT_BREAK, WORK } from '../constants';
import { pomodoro } from '../page';

interface TimerProps {
  expiryTimestamp: Date;
  autoStart: boolean;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  pomodoro : pomodoro;
}

export function Timer({ expiryTimestamp, autoStart, setInterval, pomodoro}: TimerProps) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart
  } = useTimer({
    expiryTimestamp,
    autoStart,
    onExpire: () => {
      console.warn('timer expired!');
      setInterval(prevInterval => {
        return pomodoro === "work" ? prevInterval + 1 : prevInterval;
      });
      const time = new Date();
      const addTime = pomodoro === "work" ? WORK : pomodoro === "longBreak" ? LONG_BREAK : pomodoro === "shortBreak" ? SHORT_BREAK : 0;
      time.setSeconds(time.getSeconds() + addTime);
      restart(time, autoStart);
    }
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '100px' }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      {isRunning ? <button onClick={pause}>Pause</button> : <button onClick={start}>Start</button>}
      <button onClick={() => {
        // Restarts to timer based on state
        const time = new Date();
        const addTime = pomodoro === "work" ? WORK : pomodoro === "longBreak" ? LONG_BREAK : pomodoro === "shortBreak" ? SHORT_BREAK : 0;
        time.setSeconds(time.getSeconds() + addTime);
        console.log(time, minutes * 60);
        restart(time, autoStart);
      }}>Restart</button>
    </div>
  );
}