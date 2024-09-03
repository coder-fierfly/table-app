import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Data from './pages/Data';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IterationContext from './IterationContext';

function App() {

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? JSON.parse(savedToken) : '';
  });

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    localStorage.setItem('token', JSON.stringify(token));
    if (token === "") {
      handleLogout();
    }
  }, [token]);

  return (
    <IterationContext.Provider value={{ token, setToken }}>
      <Router>
        <Routes>
          <Route
            path="/authorization"
            element={
              token ? <Navigate to="/data" /> : <Auth />
            }
          />
          <Route
            path="/data"
            element={
              token ? <Data logout={handleLogout} /> : <Navigate to="/authorization" />
            }
          />
          <Route path="*" element={<Navigate to="/authorization" />} />
        </Routes>
      </Router>
    </IterationContext.Provider >
  );
}

export default App;
