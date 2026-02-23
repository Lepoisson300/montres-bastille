import React, { useEffect, useState } from "react";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type: AlertType;
  message: string;
  duration?: number; // Time in ms (default 3000)
}

const Alert: React.FC<AlertProps> = ({ 
  type, 
  message, 
  duration = 3000, 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  // Configuration for colors based on your theme
  const styles = {
    success: {
      bg: "bg-surface",
      border: "border-primary", // Gold
      text: "text-ivory",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressBar: "bg-primary"
    },
    error: {
      bg: "bg-surface",
      border: "border-red-500",
      text: "text-red-100",
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressBar: "bg-red-500"
    },
    info: {
      bg: "bg-surface",
      border: "border-blue-400",
      text: "text-blue-100",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressBar: "bg-blue-400"
    },
    warning: {
      bg: "bg-surface",
      border: "border-yellow-500",
      text: "text-yellow-100",
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      progressBar: "bg-yellow-500"
    },
  };

  const currentStyle = styles[type];

  useEffect(() => {
    // 1. Trigger the progress bar animation immediately
    const progressInterval = setInterval(() => {
        setProgress((prev) => Math.max(prev - (100 / (duration / 50)), 0));
    }, 50);

    // 2. Start exit animation shortly before unmount
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300); // Start fading out 300ms before close

    // 3. Unmount component
    const closeTimer = setTimeout(() => {
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  return (
    <div
      className={`fixed top-24 right-4 z-50 flex flex-col overflow-hidden w-80 md:w-96 rounded-lg shadow-2xl border-l-4 ${currentStyle.bg} ${currentStyle.border} transition-all duration-300 transform ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      role="alert"
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">
          {currentStyle.icon}
        </div>
        <div className={`flex-1 font-sans text-sm font-medium ${currentStyle.text}`}>
          {message}
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
          }}
          className="ml-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-1">
        <div
            className={`h-full ${currentStyle.progressBar} transition-all ease-linear`}
            style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Alert;