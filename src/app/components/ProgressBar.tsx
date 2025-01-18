import React from "react";

interface ProgressBarProps {
  sleepTracker: number;
  sleepThreshold: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ sleepTracker, sleepThreshold }) => {
  const percentage = Math.min((sleepTracker / sleepThreshold) * 100, 100); // Ensure it doesn't exceed 100%
  let colorClass = "bg-blue-600"; // Default color

  if (percentage >= 100) {
    colorClass = "bg-red-600"; // Red for 100% or more
  } else if (percentage >= 75) {
    colorClass = "bg-yellow-500"; // Yellow for 75% or more
  }

  return (
    <div>
      <div className="flex justify-between mb-1">
        <p>Doze Meter</p>
        <span className="text-base font-medium text-blue-700 dark:text-white">Sleep Tracker</span>
        <span className="text-sm font-medium text-blue-700 dark:text-white">{${Math.round(percentage)}%}</span>
        <p>{${Math.round(percentage)}%}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={${colorClass} h-2.5 rounded-full}
          style={{ width: ${percentage}% }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;