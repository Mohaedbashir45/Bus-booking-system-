import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusSearch = () => {
    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchCriteria, setSearchCriteria] = useState({
        boardingPoint: '',
        destination: '',
        travelDate: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:5555/buses')
            .then(response => setBuses(response.data))
            .catch(error => setError('Could not fetch buses'));
    }, []);

    const fetchAvailableSeats = async (busId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5555/buses/available-seats/${busId}`);
            return response.data.available_seats;
        } catch (error) {
            console.error('Error fetching available seats:', error);
            return null;
        }
    };

    const fetchCostPerSeatById = async (busId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5555/buses/cost-per-seat/${busId}`);
            return response.data.cost_per_seat;
        } catch (error) {
            console.error('Error fetching cost per seat:', error);
            return null;
        }
    };

    const handleSearchChange = (e) => {
        setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const { boardingPoint, destination, travelDate } = searchCriteria;
        const filtered = buses.filter(bus =>
            bus.route.includes(`${boardingPoint}-${destination}`) &&
            bus.departure_time && bus.departure_time.startsWith(travelDate)
        );

        const updatedBuses = await Promise.all(
            filtered.map(async (bus) => {
                const availableSeats = await fetchAvailableSeats(bus.id);
                const costPerSeat = await fetchCostPerSeatById(bus.id);
                return { ...bus, availableSeats, costPerSeat };
            })
        );

        setFilteredBuses(updatedBuses);
        if (updatedBuses.length === 0) {
            setMessage('No buses found for the specified route and date');
        } else {
            setMessage('');
        }
    };

    const handleBookNow = (bus) => {
        navigate('/seats', { state: bus });
    };

    return (
        <div className="bus-list-container">
            <h2>Bus List</h2>

            <form onSubmit={handleSearch} className="search-form">
                <label>
                    Boarding Point:
                    <input
                        type="text"
                        name="boardingPoint"
                        value={searchCriteria.boardingPoint}
                        onChange={handleSearchChange}
                        required
                    />
                </label>
                <label>
                    Destination:
                    <input
                        type="text"
                        name="destination"
                        value={searchCriteria.destination}
                        onChange={handleSearchChange}
                        required
                    />
                </label>
                <label>
                    Day of Travel:
                    <input
                        type="date"
                        name="travelDate"
                        value={searchCriteria.travelDate}
                        onChange={handleSearchChange}
                        required
                    />
                </label>
                <button type="submit">Search Buses</button>
            </form>

            {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => (
                    <div key={bus.id} className="bus-item">
                        <p>Company Name: {bus.company_name}</p>
                        <p>Plate Number: {bus.number_plate}</p>
                        <p>Price per Seat: KSH {bus.costPerSeat}</p>
                        <p>Available Seats: {bus.availableSeats}</p>
                        <button onClick={() => handleBookNow(bus)}>Book Now</button>
                    </div>
                ))
            ) : (
                <p>No buses available</p>
            )}

            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default BusSearch;
