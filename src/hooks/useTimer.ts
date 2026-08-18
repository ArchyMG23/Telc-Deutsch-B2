import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialMinutes: number = 30, autoStart: boolean = true) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => Math.max(0, time - 1));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback((newMinutes?: number) => {
    const mins = newMinutes ?? initialMinutes;
    setIsActive(autoStart);
    setTimeLeft(mins * 60);
  }, [initialMinutes, autoStart]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft > 0 && timeLeft <= 5 * 60; // Under 5 minutes
  const isUrgent = timeLeft > 0 && timeLeft <= 1 * 60;  // Under 1 minute
  const isFinished = timeLeft === 0;

  return {
    timeLeft,
    minutes,
    seconds,
    isActive,
    isWarning,
    isUrgent,
    isFinished,
    start,
    pause,
    reset,
  };
}
