import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import BusSearch from './components/BusSearch';
import BusListing from './components/BusListing';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import AdminDashboard from './components/AdminDashboard';
import { JourneyProvider } from './components/JourneyContext';
import Dashboard from './components/Dashboard';


const App = () => {
  return (
    <Router>
      <JourneyProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<BusSearch />} />
        <Route path="/results" element = {<BusListing />} />
        <Route path="/seats" element={<SeatSelection/>} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </JourneyProvider>
    </Router>
  );
};

export default App;
