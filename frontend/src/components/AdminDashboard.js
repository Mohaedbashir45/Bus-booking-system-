import React, { useState, useContext } from 'react';
import { FaPlus } from 'react-icons/fa';
import { JourneyContext } from './JourneyContext';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const { addJourney } = useContext(JourneyContext);
  const [upcomingJourneys] = useState([]);
  const [newJourney, setNewJourney] = useState({
    Bus: '',
    boardingPoint: '',
    dropOffPoint: '',
    departureTime: '',
    arrivalTime: '',
    seats: 0,
    ticketPrice: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJourney((prevJourney) => ({
      ...prevJourney,
      [name]: value,
    }));
  };

  const handleAddJourney = () => {
    addJourney(newJourney);
    setNewJourney({
      Bus: '',
      boardingPoint: '',
      dropOffPoint: '',
      departureTime: '',
      arrivalTime: '',
      seats: 0,
      ticketPrice: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-white text-lg">
            Welcome to the Admin Dashboard! Here, you can manage and add new journeys.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Add Journey Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold mb-4 text-red-500">Add Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="Bus" className="block text-gray-700 font-bold mb-2">
                Bus Company
              </label>
              <input
                type="text"
                id="Bus"
                name="Bus"
                value={newJourney.Bus}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="boardingPoint" className="block text-gray-700 font-bold mb-2">
                Boarding Point
              </label>
              <input
                type="text"
                id="boardingPoint"
                name="boardingPoint"
                value={newJourney.boardingPoint}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="dropOffPoint" className="block text-gray-700 font-bold mb-2">
                Drop Off Point
              </label>
              <input
                type="text"
                id="dropOffPoint"
                name="dropOffPoint"
                value={newJourney.dropOffPoint}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="departureTime" className="block text-gray-700 font-bold mb-2">
                Departure Time
              </label>
              <input
                type="text"
                id="departureTime"
                name="departureTime"
                value={newJourney.departureTime}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="arrivalTime" className="block text-gray-700 font-bold mb-2">
                Arrival Time
              </label>
              <input
                type="text"
                id="arrivalTime"
                name="arrivalTime"
                value={newJourney.arrivalTime}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="seats" className="block text-gray-700 font-bold mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={newJourney.seats}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="ticketPrice" className="block text-gray-700 font-bold mb-2">
                Ticket Price
              </label>
              <input
                type="number"
                id="ticketPrice"
                name="ticketPrice"
                value={newJourney.ticketPrice}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <button
            onClick={handleAddJourney}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4 flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Add Journey
          </button>
        </div>

        {/* Upcoming Journeys */}
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
    </div>
  );
};

export default AdminDashboard;