import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalFare } = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(totalFare || '');
  const [payBill] = useState('474747');

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePayment = () => {
    // Handle payment logic here
    // You can send the phoneNumber, amount, and payBill to your backend for processing
    console.log('Phone Number:', phoneNumber);
    console.log('Amount:', amount);
    console.log('PayBill:', payBill);

    // Navigate to success page or perform any other action after payment
    navigate('/success');
  };

  return (
    <>
      <Navbar />
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Payment</h1>
          <p className="text-white text-lg">
            Complete your payment for the selected seats.
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter amount"
          />
        </div>
        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-2">Payment Platform: M-Pesa</p>
          <p className="font-medium text-gray-700">PayBill: {payBill}</p>
        </div>
        <button
          onClick={handlePayment}
          className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Pay Now
        </button>
      </div>
    </>
  );
};

export default Payment;