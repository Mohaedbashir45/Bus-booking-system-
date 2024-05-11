import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component

// Array of 42 seats
const seats = Array.from({ length: 42 }, (_, i) => {
  const number = i + 1;
  const available = Math.random() < 0.7; // 70% chance of being available
  const type = available ? (Math.random() < 0.2 ? 'vip' : 'available') : 'occupied';
  return { number, available, type };
});

const SeatSelection = () => {
  const location = useLocation();
  const {
    busName,
    route,
    departureTime,
    arrivalTime,
    normalPrice,
    vipPrice,
  } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const totalFare = selectedSeats.reduce((acc, seat) => {
    return seat.type === 'vip' ? acc + vipPrice : acc + normalPrice;
  }, 0);

  const handleSeatClick = (seat) => {
    if (seat.available) {
      setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
    }
  };

  const handleRemoveSeat = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.filter((seat) => seat.number !== seatNumber)
    );
  };

  return (
    <>
    <Navbar />
    <div className="bg-red-500 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Seat Selection</h1>
        <p className="text-white text-lg">
          Select your desired seat(s) for your bus journey.
        </p>
      </div>
    </div>
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-red-500 text-center">
          Seat Selection - {busName}
        </h2>
        <p className="text-center">
          Route: {route} | Departure: {departureTime} | Arrival: {arrivalTime}
        </p>
      </div>
      <div className="grid grid-cols-7 gap-4 mx-auto max-w-3xl">
        {seats.map((seat) => (
          <div
            key={seat.number}
            className={`w-12 h-12 rounded-md cursor-pointer transition-colors duration-300 flex items-center justify-center text-lg font-bold ${
              seat.available
                ? seat.type === 'available'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } ${selectedSeats.some((selectedSeat) => selectedSeat.number === seat.number) ? 'border-4 border-blue-500' : ''}`}
            onClick={() => handleSeatClick(seat)}
          >
            {seat.number}
          </div>
        ))}
      </div>
      <div className="mt-8 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full bg-green-500 mr-4"></div>
          <span className="text-lg">Available (KSH {normalPrice})</span>
        </div>
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full bg-red-500 mr-4"></div>
          <span className="text-lg">Occupied</span>
        </div>
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full bg-yellow-500 mr-4"></div>
          <span className="text-lg">VIP (KSH {vipPrice})</span>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Selected Seats:</h3>
        {selectedSeats.length > 0 ? (
          <ul className="list-disc list-inside">
            {selectedSeats.map((seat) => (
              <li
                key={seat.number}
                className="flex items-center justify-between mb-2"
              >
                <span>Seat {seat.number}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveSeat(seat.number)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No seats selected</p>
        )}
      </div>
      <div className="mt-8 text-center">
        <p className="text-2xl font-bold mb-2">
          Total Seats Selected: {selectedSeats.length}
        </p>
        <p className="text-3xl font-bold text-red-500">
          Total Fare: KSH {totalFare}
        </p>
      </div>
    </div>
    </>
  );
};

export default SeatSelection;