import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import BusSearch from './components/BusSearch';
import BusListing from './components/BusListing';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<BusSearch />} />
        <Route path="/results" element = {<BusListing />} />
        
      </Routes>
    </Router>
  );
};

export default App;
