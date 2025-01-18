import React from 'react';

export default function Home() {
  return (
    <div className="relative bg-gray-900">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to Next.js with Tailwind CSS</h1>
        <p className="mt-4 text-gray-700">This is a sample project.</p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Click Me
        </button>
   
      </div>
    </div>
  );
}
