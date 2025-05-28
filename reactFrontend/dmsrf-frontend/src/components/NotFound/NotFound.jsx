import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved. Maybe try going back to the homepage?
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300 font-medium shadow-md"
        >
          Back to Home
        </Link>

        {/* <div className="mt-8">
          <img
            src="https://illustrations.popsy.co/gray/web-not-found.svg"
            alt="Page Not Found Illustration"
            className="w-full max-w-xs mx-auto opacity-80"
          />
        </div> */}
      </div>
    </div>
  );
};

export default NotFound;
