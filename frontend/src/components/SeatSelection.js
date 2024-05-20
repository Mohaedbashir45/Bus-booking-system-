import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bus = location.state;

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalFare, setTotalFare] = useState(0);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5555/buses/${bus.id}/seats`);
        const totalSeats = response.data.total_seats;
        const availableSeats = response.data.available_seats;
        const occupiedSeats = totalSeats - availableSeats;
  
        const seatArray = Array.from({ length: totalSeats }, (_, i) => ({
          number: i + 1,
          status: i < occupiedSeats ? 'occupied' : 'available',
          cost: bus.cost_per_seat
        }));
  
        setSeats(seatArray);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };
  
    fetchSeats();
  }, [bus.id, bus.cost_per_seat]);

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.number === seat.number);
    if (!isSelected) {
      setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
    } else {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter((selectedSeat) => selectedSeat.number !== seat.number)
      );
    }
  };

  useEffect(() => {
    const fare = selectedSeats.reduce((acc, seat) => acc + seat.cost, 0);
    setTotalFare(fare);
  }, [selectedSeats]);

  const handlePayment = () => {
    navigate('/payment', { state: { totalFare } });
  };

  return (
    <>
      <Navbar />
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Seat Selection</h1>
          <p className="text-white text-lg">Select your desired seat(s) for your bus journey.</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-red-500 text-center">Seat Selection - {bus.company_name}</h2>
          <p className="text-center">
            Route: {bus.route} | Departure: {bus.departure_time} | Arrival: {bus.arrival_time}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 mx-auto max-w-3xl">
          {seats.map((seat) => (
            <div
              key={seat.number}
              className={`w-12 h-12 rounded-md cursor-pointer transition-colors duration-300 flex items-center justify-center text-lg font-bold ${
                seat.status === 'available'
                  ? 'bg-gray-300 hover:bg-gray-400'
                  : 'bg-red-300'
              } ${selectedSeats.some((selectedSeat) => selectedSeat.number === seat.number) ? 'border-4 border-blue-500' : ''}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.number}
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-300 mr-4"></div>
            <span className="text-lg">Available (KSH {bus.normalPrice})</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-red-300 mr-4"></div>
            <span className="text-lg">Occupied</span>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Selected Seats:</h3>
          {selectedSeats.length > 0 ? (
            <ul className="list-disc list-inside">
              {selectedSeats.map((seat) => (
                <li key={seat.number} className="flex items-center justify-between mb-2">
                  <span>Seat {seat.number}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleSeatClick(seat)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No seats selected</p>
          )}
        </div>
        <div className="mt-8 text-center">
          <p className="text-2xl font-bold mb-2">Total Seats Selected: {selectedSeats.length}</p>
          <p className="text-3xl font-bold text-red-500">Total Fare: KSH {totalFare}</p>
          <button
            onClick={handlePayment}
            className="mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default SeatSelection;