import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';


const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <nav className="bg-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center md:order-2">
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={handleToggle}
                type="button"
                className="bg-red-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {navbarOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 md:order-1 flex items-center">
          <img src="./logo.jpg" alt="Company Logo" className="h-16 w-16 rounded-full border-2 border-gray-300 p-1 mr-4" />


            <a href="/" className="text-white font-bold text-xl">
              Basi Go
            </a>
          </div>
          <div className="hidden md:block md:order-3">
            <div className="ml-4 flex items-center space-x-4">
            <a
            href="/"
            className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </a>
              <a
                href="/register"
                className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Register
              </a>
              <a
                href="/booking"
                className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Buses
              </a>
              <a
                href="/bus-management"
                className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Bus Management
              </a>
              <a
                href="/scheduling"
                className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Scheduling
              </a>
              <a
                href="/seat-booking"
                className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Seat Booking
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${navbarOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a
            href="/"
            className="text-gray-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="/register"
            className="text-gray-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Register
          </a>
          <a
            href="/booking"
            className="text-gray-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Buses
          </a>
          <a
            href="/bus-management"
            className="text-gray-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Bus Management
          </a>
          <a
            href="/scheduling"
            className="text-gray-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Scheduling
          </a>
          <a
            href="/seat-booking"
            className="text-gray-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Seat Booking
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;