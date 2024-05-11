import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt,FaBus } from 'react-icons/fa';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const BusSearch = () => {
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
  const upcomingJourneys = [
    {
      id: 1,
      Bus: 'Mbukinya Bus Company',
      boardingPoint: 'Nairobi CBD',
      dropOffPoint: 'Kakamega,shamakhokho',
      departureTime: '09:00 AM',
      arrivalTime: '11:00 PM',
    },
    {
      id: 2,
      Bus:'Mash Poa',
      boardingPoint: 'Nairobi,Tea Room',
      dropOffPoint: 'Mombasa',
      departureTime: '8:00 PM',
      arrivalTime: '06:00 AM',
    },
    {
      id: 3,
      Bus:'GuardianAngel Bus Company',
      boardingPoint: 'Kisumu City',
      dropOffPoint: 'Nairobi next to Railways station',
      departureTime: '07:00 AM',
      arrivalTime: '04:00 PM',
    },
    {
      id: 4,
      Bus:'Chania Executive',
      boardingPoint: 'Nairobi,Accra Road',
      dropOffPoint: 'Nyeri',
      departureTime: '10:00 AM',
      arrivalTime: '02:00 PM',
    },
  ];

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
      {/* Upcoming Journeys Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Upcoming Journeys
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingJourneys.map((journey) => (
              <div
                key={journey.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <FaBus className="text-red-500 mr-2" />
                  <h3 className="text-lg font-bold">{journey.Bus}</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  <FaMapMarkerAlt className="inline-block mr-2" />
                  {journey.boardingPoint}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaMapMarkerAlt className="inline-block mr-2" />
                  {journey.dropOffPoint}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Departure:</p>
                    <p className="font-bold">{journey.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Arrival:</p>
                    <p className="font-bold">{journey.arrivalTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSearch;