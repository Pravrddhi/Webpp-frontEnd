import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRegistration from './Components/userRegistration/UserRegistration';
import OtpLogin from './Components/Login/logIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OtpLogin />} />
        <Route path="/register" element={<UserRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
