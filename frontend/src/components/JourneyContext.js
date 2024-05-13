import React, { createContext, useState } from 'react';

export const JourneyContext = createContext();

export const JourneyProvider = ({ children }) => {
  const [upcomingJourneys, setUpcomingJourneys] = useState([]);

  const addJourney = (newJourney) => {
    setUpcomingJourneys((prevJourneys) => [...prevJourneys, newJourney]);
  };

  return (
    <JourneyContext.Provider value={{ upcomingJourneys, addJourney }}>
      {children}
    </JourneyContext.Provider>
  );
};