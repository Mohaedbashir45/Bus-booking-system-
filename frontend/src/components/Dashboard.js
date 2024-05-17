import React, { useState } from 'react';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    number_plate: '',
    no_of_seats: '',
    cost_per_seat: '',
    route: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('http://127.0.0.1:5555/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        alert(data.message);
        setFormData({
          company_name: '',
          number_plate: '',
          no_of_seats: '',
          cost_per_seat: '',
          route: '',
        });
      } else {
        console.error(data.error);
        alert('Failed to create bus. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during bus creation. Please try again.');
    }
  };


  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Bus</h1>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <label htmlFor="companyName" className="block font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="company_name" // Change companyname to company_name
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required // Add the required attribute
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberPlate" className="block font-medium text-gray-700">
            Number Plate
          </label>
          <input
            type="text"
            id="number_plate"
            name="number_plate"
            value={formData.number_plate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="noOfSeats" className="block font-medium text-gray-700">
            Number of Seats
          </label>
          <input
               type="number"
               id="no_of_seats" // Change noOfSeats to no_of_seats
               name="no_of_seats"
               value={formData.no_of_seats}
               onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="costPerSeat" className="block font-medium text-gray-700">
            Cost per Seat
          </label>
          <input
            type="number"
            id="cost_per_seat" // Change costPerSeat to cost_per_seat
            name="cost_per_seat"
            value={formData.cost_per_seat}
            onChange={handleChange}          
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="route" className="block font-medium text-gray-700">
            Route
          </label>
          <input
            type="text"
            id="route"
            name="route"
            value={formData.route}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Create Bus
        </button>
      </form>
    </div>
  );
};

export default Dashboard;