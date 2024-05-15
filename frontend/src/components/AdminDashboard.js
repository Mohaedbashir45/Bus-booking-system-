import React, { useState, useContext, useEffect,useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { JourneyContext } from './JourneyContext';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const { addJourney } = useContext(JourneyContext);
  const [upcomingJourneys, setUpcomingJourneys] = useState([]);
  const [newJourney, setNewJourney] = useState({
    driverId: '', // Replace with the actual driver ID
    Bus: '',
    boardingPoint: '',
    dropOffPoint: '',
    departureTime: '',
    arrivalTime: '',
    seats: 0,
    ticketPrice: 0,
  });
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    busName: '',
    seats: 0,
    costPerSeat: 0,
  });
  const fetchBuses = useCallback(async () => {
    try {
      // Make an API call to fetch the list of buses registered by the driver
      const response = await fetch(`/api/buses?driverId=${newJourney.driverId}`);
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  }, [newJourney.driverId]);

  useEffect(() => {
    // Fetch the list of buses registered by the driver
    fetchBuses();
  }, [newJourney.driverId, fetchBuses]);

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
      driverId: '', // Replace with the actual driver ID
      Bus: '',
      boardingPoint: '',
      dropOffPoint: '',
      departureTime: '',
      arrivalTime: '',
      seats: 0,
      ticketPrice: 0,
    });
  };

  const handleBusInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus((prevBus) => ({
      ...prevBus,
      [name]: value,
    }));
  };

  const handleAddBus = async () => {
    try {
      // Make an API call to add a new bus
      const response = await fetch('http://127.0.0.1:5555/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBus,
          driverId: newJourney.driverId, // Add the driver ID to the request
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Add the new bus to the list of buses
        setBuses([...buses, data]);
        setNewBus({
          busName: '',
          seats: 0,
          costPerSeat: 0,
        });
      } else {
        console.error('Error adding bus:', data.error);
      }
    } catch (error) {
      console.error('Error adding bus:', error);
    }
  };

  const handleUpdateBus = async (bus) => {
    try {
      // Make an API call to update the bus
      const response = await fetch(`/api/buses/${bus.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bus),
      });
      const data = await response.json();
      if (response.ok) {
        // Update the list of buses with the updated bus
        setBuses(buses.map((b) => (b.id === bus.id ? data : b)));
      } else {
        console.error('Error updating bus:', data.error);
      }
    } catch (error) {
      console.error('Error updating bus:', error);
    }
  };

  const handleDeleteBus = async (bus) => {
    try {
      // Make an API call to delete the bus
      const response = await fetch(`/api/buses/${bus.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted bus from the list of buses
        setBuses(buses.filter((b) => b.id !== bus.id));
      } else {
        console.error('Error deleting bus:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };
  const fetchUpcomingJourneys = useCallback(async () => {
    try {
      // Make an API call to fetch the upcoming journeys
      const response = await fetch(`/api/journeys?driverId=${newJourney.driverId}`);
      const data = await response.json();
      setUpcomingJourneys(data);
    } catch (error) {
      console.error('Error fetching upcoming journeys:', error);
    }
  }, [newJourney.driverId]);
  
  useEffect(() => {
    // Fetch the upcoming journeys
    fetchUpcomingJourneys();
  }, [fetchUpcomingJourneys]);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Driver's Dashboard</h1>
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
        Select Bus
      </label>
      <select
        id="Bus"
        name="Bus"
        value={newJourney.Bus}
        onChange={handleInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Select a Bus</option>
        {buses.map((bus) => (
          <option key={bus.id} value={bus.busName}>
            {bus.busName}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="route" className="block text-gray-700 font-bold mb-2">
        Route
      </label>
      <select
        id="route"
        name="route"
        value={newJourney.route}
        onChange={handleInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Select a Route</option>
        {buses.map((bus) => (
          <option key={bus.id} value={bus.route}>
            {bus.route}
          </option>
        ))}
        <option value="custom">Custom Route</option>
      </select>
    </div>
    {newJourney.route === 'custom' && (
      <div>
        <label htmlFor="customRoute" className="block text-gray-700 font-bold mb-2">
          Custom Route
        </label>
        <input
          type="text"
          id="customRoute"
          name="customRoute"
          value={newJourney.customRoute}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    )}
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
  
        {/* Bus Management */}
<div className="bg-white rounded-lg shadow-md p-8 mb-8">
  <h2 className="text-xl font-bold mb-4 text-red-500">Manage Buses</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
    <div>
      <label htmlFor="busName" className="block text-gray-700 font-bold mb-2">
        Bus Name
      </label>
      <input
        type="text"
        id="busName"
        name="busName"
        value={newBus.busName}
        onChange={handleBusInputChange}
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
        value={newBus.seats}
        onChange={handleBusInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div>
      <label htmlFor="costPerSeat" className="block text-gray-700 font-bold mb-2">
        Cost Per Seat
      </label>
      <input
        type="number"
        id="costPerSeat"
        name="costPerSeat"
        value={newBus.costPerSeat}
        onChange={handleBusInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div>
      <label htmlFor="route" className="block text-gray-700 font-bold mb-2">
        Route
      </label>
      <input
        type="text"
        id="route"
        name="route"
        value={newBus.route}
        onChange={handleBusInputChange}
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
        value={newBus.departureTime}
        onChange={handleBusInputChange}
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
        value={newBus.arrivalTime}
        onChange={handleBusInputChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </div>
  <button
    onClick={handleAddBus}
    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center"
  >
    <FaPlus className="mr-2" />
    Add Bus
  </button>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {buses.map((bus) => (
      <div key={bus.id} className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-red-500 mb-2">{bus.busName}</h3>
          <p className="text-gray-600 mb-1">Seats: {bus.seats}</p>
          <p className="text-gray-600 mb-1">Cost Per Seat: Ksh {bus.costPerSeat}</p>
          <p className="text-gray-600 mb-1">Route: {bus.route}</p>
          <p className="text-gray-600 mb-1">Departure Time: {bus.departureTime}</p>
          <p className="text-gray-600 mb-1">Arrival Time: {bus.arrivalTime}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleUpdateBus(bus)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2 flex items-center justify-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteBus(bus)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
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
          <p className="text-gray-600 mb-1">Boarding Point: {journey.boardingPoint}</p>
          <p className="text-gray-600 mb-1">Drop Off Point: {journey.dropOffPoint}</p>
          <p className="text-gray-600 mb-1">Departure Time: {journey.departureTime}</p>
          <p className="text-gray-600 mb-1">Arrival Time: {journey.arrivalTime}</p>
          <p className="text-gray-600 mb-1">Seats: {journey.seats}</p>
          <p className="text-gray-600 mb-1">Ticket Price: Ksh {journey.ticketPrice}</p>
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