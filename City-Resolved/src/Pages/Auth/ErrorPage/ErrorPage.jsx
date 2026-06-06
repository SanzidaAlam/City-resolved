import React from 'react';
import { Link } from 'react-router';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center text-center p-6">
            
            <div className="text-9xl text-error mb-4 animate-bounce">
                <FaExclamationTriangle />
            </div>

            <h1 className="text-8xl font-black text-gray-800 mb-2">404</h1>

            <h2 className="text-3xl font-bold text-gray-700 mb-4">
                Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-500 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link to="/" className="btn btn-primary btn-lg gap-2 shadow-lg hover:scale-105 transition-transform">
                <FaHome /> Go Back Home
            </Link>

            <div className="absolute top-10 left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl -z-10"></div>
        </div>
    );
};

export default ErrorPage;