import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AddBusForm = () => {
    const [formData, setFormData] = useState({
        company_name: '',
        number_plate: '',
        no_of_seats: '',
        cost_per_seat: '',
        route: '',
        driver_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5555/buses', formData);
            alert('Bus created successfully');
            setFormData({
                company_name: '',
                number_plate: '',
                no_of_seats: '',
                cost_per_seat: '',
                route: '',
                driver_id: ''
            });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred, please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h3>Add Bus</h3>
            <label>
                Company Name:
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
            </label>
            <label>
                Number Plate:
                <input type="text" name="number_plate" value={formData.number_plate} onChange={handleChange} required />
            </label>
            <label>
                Number of Seats:
                <input type="number" name="no_of_seats" value={formData.no_of_seats} onChange={handleChange} required />
            </label>
            <label>
                Cost per Seat:
                <input type="number" name="cost_per_seat" value={formData.cost_per_seat} onChange={handleChange} required />
            </label>
            <label>
                Route:
                <input type="text" name="route" value={formData.route} onChange={handleChange} required />
            </label>
            <label>
                Driver ID:
                <input type="text" name="driver_id" value={formData.driver_id} onChange={handleChange} required />
            </label>
            <button type="submit">Add Bus</button>
        </form>
    );
};

const ScheduleBusForm = () => {
    const [numberPlate, setNumberPlate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [route, setRoute] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5555/buses/schedule', {
                number_plate: numberPlate,
                departure_time: departureTime,
                route: route
            });
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            setError(error.response?.data.error || 'An error occurred');
            setMessage('');
        }
    };

    return (
        <div className="form-container">
            <h3>Schedule a Bus</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Number Plate:
                    <input
                        type="text"
                        value={numberPlate}
                        onChange={(e) => setNumberPlate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Departure Time:
                    <input
                        type="datetime-local"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Route:
                    <input
                        type="text"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Schedule Bus</button>
            </form>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5555/buses')
            .then(response => setBuses(response.data))
            .catch(error => setError('Could not fetch buses'));
    }, []);

    const handleUpdate = async (busId) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5555/buses/${busId}`, {
                route: selectedBus.route,
                departure_time: selectedBus.departure_time
            });
            setMessage(response.data.message);
            setError('');
            const updatedBuses = buses.map(bus => bus.id === busId ? { ...bus, ...selectedBus } : bus);
            setBuses(updatedBuses);
        } catch (error) {
            setError(error.response?.data.error || 'An error occurred');
            setMessage('');
        }
    };

    const handleDelete = async (busId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5555/buses/${busId}`);
            setMessage(response.data.message);
            setError('');
            setBuses(buses.filter(bus => bus.id !== busId));
        } catch (error) {
            setError(error.response?.data.error || 'An error occurred');
            setMessage('');
        }
    };

    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
    };

    const handleChange = (e) => {
        setSelectedBus({ ...selectedBus, [e.target.name]: e.target.value });
    };

    return (
        <div className="bus-list-container">
            <h2>Bus List</h2>
            {buses.map(bus => (
                <div key={bus.id} className="bus-item">
                    <p>{bus.number_plate}</p>
                    <button onClick={() => handleSelectBus(bus)}>Update</button>
                    <button onClick={() => handleDelete(bus.id)}>Delete</button>
                </div>
            ))}
            {selectedBus && (
                <div className="form-container">
                    <h3>Update Bus</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedBus.id); }}>
                        <label>
                            Route:
                            <input
                                type="text"
                                name="route"
                                value={selectedBus.route}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Departure Time:
                            <input
                                type="datetime-local"
                                name="departure_time"
                                value={selectedBus.departure_time}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <button type="submit">Schedule Bus</button>
                    </form>
                </div>
            )}
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <AddBusForm />
            <ScheduleBusForm />
            <BusList />
        </div>
    );
};

export default AdminDashboard;