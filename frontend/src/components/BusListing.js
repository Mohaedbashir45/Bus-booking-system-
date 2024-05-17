import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const BusListingCard = ({ busName, route, departureTime, arrivalTime, remainingSeats, normalPrice, vipPrice }) => {
    const navigate = useNavigate();
   
    const handleSelectSeat = () => {
        navigate('/seats', {
          state: {
            busName,
            route,
            departureTime,
            arrivalTime,
            remainingSeats,
            normalPrice,
            vipPrice,
          },
        });
      };
    
    return (
    <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-bold mr-2">{busName}</h3>
        <span className="bg-yellow-500 text-white px-2 py-1 rounded-md">{route}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-600">Departure:</p>
          <p className="font-bold">{departureTime}</p>
        </div>
        <div>
          <p className="text-gray-600">Arrival:</p>
          <p className="font-bold">{arrivalTime}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">Remaining Seats: {remainingSeats}</p>
        <div>
          <p className="text-gray-600">Normal: KSH {normalPrice}</p>
          <p className="text-gray-600">VIP: KSH {vipPrice}</p>
        </div>
      </div>
      <button className="w-full py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
        onClick={handleSelectSeat}
       >
        Select Seat
      </button>
    </div>
  );
};

const BusListing = () => {
  const location = useLocation();
  const { filteredJourneys } = location.state || {};

  return (
    <div>
      <Navbar />
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Bus Booking App</h1>
          <p className="text-white text-lg">Find and book your bus tickets with ease.</p>
        </div>
      </div>
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Available Buses</h2>
          <div className="grid grid-cols-1 gap-6">
            {filteredJourneys?.map((journey) => (
              <BusListingCard
                key={journey.id}
                busName={journey.Bus}
                route={`${journey.boardingPoint} - ${journey.dropOffPoint}`}
                departureTime={journey.departureTime}
                arrivalTime={journey.arrivalTime}
                remainingSeats={16} // Replace with actual remaining seats data
                normalPrice={1300} // Replace with actual normal price data
                vipPrice={1800} // Replace with actual VIP price data
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusListing;