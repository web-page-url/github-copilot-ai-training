'use client';

import { useState, useEffect, useRef } from 'react';
import { TimerState } from '@/types/learning';

interface TimerProps {
  initialTime: number; // in seconds
  onComplete: () => void;
  onTick?: (timeLeft: number) => void;
  autoStart?: boolean;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'warning' | 'danger';
}

export default function Timer({ 
  initialTime, 
  onComplete, 
  onTick, 
  autoStart = false,
  showProgress = true,
  size = 'md',
  color = 'primary'
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-lg',
    lg: 'w-32 h-32 text-xl'
  };

  const colorClasses = {
    primary: 'text-blue-600 stroke-blue-600',
    warning: 'text-yellow-600 stroke-yellow-600',
    danger: 'text-red-600 stroke-red-600'
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getColorBasedOnTime = (): 'primary' | 'warning' | 'danger' => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage <= 20) return 'danger';
    if (percentage <= 50) return 'warning';
    return color;
  };

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (onTick) onTick(newTime);
          
          if (newTime <= 0) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft, onComplete, onTick]);

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const reset = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
    setIsPaused(false);
  };

  const currentColor = getColorBasedOnTime();
  const progress = getProgressPercentage();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular Progress Timer */}
      <div className={`relative ${sizeClasses[size]}`}>
        {showProgress && (
          <svg
            className="absolute inset-0 transform -rotate-90"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={colorClasses[currentColor]}
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
        )}
        
        {/* Time display */}
        <div className={`absolute inset-0 flex items-center justify-center font-mono font-bold ${colorClasses[currentColor]}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex gap-2">
        {!isActive && timeLeft > 0 && (
          <button
            onClick={start}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Start
          </button>
        )}
        
        {isActive && !isPaused && (
          <button
            onClick={pause}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            Pause
          </button>
        )}
        
        {isActive && isPaused && (
          <button
            onClick={resume}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Resume
          </button>
        )}
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Status indicator */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {isActive && !isPaused && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Running
          </span>
        )}
        {isPaused && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Paused
          </span>
        )}
        {!isActive && timeLeft === 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Time's up!
          </span>
        )}
        {!isActive && timeLeft > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            Ready
          </span>
        )}
      </div>
    </div>
  );
} 