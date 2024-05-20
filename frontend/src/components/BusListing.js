import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusListing = ({ location }) => {
    const [filteredBuses, setFilteredBuses] = useState([]);
    const { boardingPoint, destination, travelDate } = location.state;

    useEffect(() => {
        const fetchFilteredBuses = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5555/buses/filter?boardingPoint=${boardingPoint}&destination=${destination}&travelDate=${travelDate}`);
                setFilteredBuses(response.data);
            } catch (error) {
                console.error('Error fetching filtered buses:', error);
            }
        };

        fetchFilteredBuses();
    }, [boardingPoint, destination, travelDate]);

    return (
        <div className="bus-listing-container">
            <h2>Filtered Buses</h2>
            {/* Display filtered buses */}
            {filteredBuses.map((bus) => (
                <div key={bus.id} className="bus-item">
                    <p>Company Name: {bus.company_name}</p>
                    {/* Display other bus details... */}
                </div>
            ))}
        </div>
    );
};

export default BusListing;