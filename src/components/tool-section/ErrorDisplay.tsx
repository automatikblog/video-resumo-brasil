
import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mt-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
      <p>{error}</p>
    </div>
  );
};

export default ErrorDisplay;
