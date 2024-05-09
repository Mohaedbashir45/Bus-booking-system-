import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-red-500 py-16 sm:py-20 px-4 text-white">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Effortless Bus Travel</h1>
        <p className="text-base mb-6 sm:text-lg sm:mb-8">
          Our bus management system streamlines your journey, providing seamless scheduling, real-time updates, and
          hassle-free bookings.
        </p>
        <Link to="/register">
          <button className="bg-white text-red-500 py-3 px-6 rounded-md font-semibold hover:bg-red-600 hover:text-white transition-colors duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-red-500">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white shadow-md rounded-md p-5 sm:p-6">
              <div className="bg-red-500 text-white p-4 rounded-full mb-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Stay informed with real-time bus tracking and accurate arrival/departure times.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-md p-5 sm:p-6">
              <div className="bg-red-500 text-white p-4 rounded-full mb-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Schedules and Routes</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Access up-to-date schedules and routes for seamless journey planning.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-md p-5 sm:p-6">
              <div className="bg-red-500 text-white p-4 rounded-full mb-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Online Bookings</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Convenient online booking system for hassle-free ticket purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-500 py-6 px-4 text-white">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>&copy; 2023 Bus Management. All rights reserved.</div>
          <nav className="mt-4 sm:mt-0">
            <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact Us</li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;