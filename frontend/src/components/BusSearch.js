import React, { useState, useContext } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { JourneyContext } from './JourneyContext';

const BusSearch = () => {
  const { upcomingJourneys } = useContext(JourneyContext);
  const [boardingPoint, setBoardingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter the upcomingJourneys array based on the user's input
    const filteredJourneys = upcomingJourneys.filter((journey) => {
      const departureDate = new Date(journey.departureTime);
      const selectedDate = new Date(travelDate);
      return (
        journey.boardingPoint.toLowerCase().includes(boardingPoint.toLowerCase()) &&
        journey.dropOffPoint.toLowerCase().includes(destination.toLowerCase()) &&
        departureDate.toDateString() === selectedDate.toDateString()
      );
    });

    // Navigate to the /results route with the filtered journeys
    navigate('/results', { state: { filteredJourneys } });
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome to Bus Booking App
          </h1>
          <p className="mt-2 text-xl text-white">
            Find and book your bus tickets with ease.
          </p>
        </div>
      </div>
      {/* Search Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-500">
            Search for Bus
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="boardingPoint"
                className="block text-gray-700 font-bold mb-2"
              >
                Boarding Point
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="boardingPoint"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter boarding point"
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                />
                <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="destination"
                className="block text-gray-700 font-bold mb-2"
              >
                Destination
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="destination"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="travelDate"
                className="block text-gray-700 font-bold mb-2"
              >
                Travel Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="travelDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Find Bus
            </button>
          </form>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold mb-4 text-red-500">Upcoming Journeys</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingJourneys.map((journey, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-bold text-red-500 mr-2">{journey.Bus}</h3>
                  </div>
                  <p className="text-gray-600 mb-1">
                    Boarding Point: {journey.boardingPoint}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Drop Off Point: {journey.dropOffPoint}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Departure Time: {journey.departureTime}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Arrival Time: {journey.arrivalTime}
                  </p>
                  <p className="text-gray-600 mb-1">Seats: {journey.seats}</p>
                  <p className="text-gray-600 mb-1">
                    Ticket Price: Ksh {journey.ticketPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default BusSearch;