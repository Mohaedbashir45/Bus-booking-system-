import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import 'animate.css/animate.min.css';


const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <section className="bg-red-500 py-8 sm:py-12 md:py-16 px-4 text-white">
  <div className="max-w-screen-xl mx-auto flex flex-col items-center sm:flex-row sm:items-start">
    <div className="mb-6 sm:mr-8 sm:w-1/2">
      <img
        src="/Hero.avif"
        alt="Hero"
        className="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <div className="sm:w-1/2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center sm:text-left">
        Embrace the Journey, Leave the Stress Behind
      </h1>
      <p className="text-base mb-8 text-center sm:text-left">
        We understand that travel should be an enjoyable experience, not a hassle.
      </p>
      <div className="flex justify-center sm:justify-start">
        <Link to="/register">
          <button className="bg-white text-red-500 py-2 md:py-3 px-4 md:px-6 rounded-md font-semibold hover:bg-red-600 hover:text-white transition-colors duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  </div>
</section>     
{/* Features Section */}
<section className="py-8 sm:py-12 px-4">
  <div className="max-w-screen-xl mx-auto">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-red-500 text-center">Features</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Feature 1 */}
      <div className="bg-white shadow-md rounded-md p-4 animate__animated animate__flipInX">
        <div className="flex items-center mb-2">
          <div className="bg-red-500 text-white p-2 rounded-full mr-2 w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Real-time Tracking</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Stay informed with real-time bus tracking and accurate arrival/departure times.</p>
        <img src="/bus3.avif" alt="Real-time Tracking" className="max-w-full rounded-lg shadow-sm" />
      </div>

      {/* Feature 2 */}
      <div className="bg-white shadow-md rounded-md p-4">
        <div className="flex items-center mb-2">
          <div className="bg-red-500 text-white p-2 rounded-full mr-2 w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Schedules and Routes</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Access up-to-date schedules and routes for seamless journey planning.</p>
        <img src="/booking.jpg" alt="Schedules and Routes" className="max-w-full rounded-lg shadow-sm" />
      </div>

      {/* Feature 3 */}
      <div className="bg-white shadow-md rounded-md p-4">
        <div className="flex items-center mb-2">
          <div className="bg-red-500 text-white p-2 rounded-full mr-2 w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Online Bookings</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Convenient online booking system for hassle-free ticket purchases.</p>
        <img src="/book.jpg" alt="Online Bookings" className="max-w-full rounded-lg shadow-sm" />
      </div>

      {/* Feature 4 */}
      <div className="bg-white shadow-md rounded-md p-4">
        <div className="flex items-center mb-2">
          <div className="bg-red-500 text-white p-2 rounded-full mr-2 w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Personalized Experience</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Enjoy a tailored experience with customizable preferences and personalized recommendations.</p>
        <img src="/bus.jpg" alt="Personalized Experience" className="max-w-full rounded-lg shadow-sm" />
      </div>
    </div>
  </div>
</section>

<footer className="bg-red-500 py-6 px-4 text-white">
  <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center">
    <div className="text-center sm:text-left mb-4 sm:mb-0">&copy; 2023 Bus Management. All rights reserved.</div>
    <nav>
      <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
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
