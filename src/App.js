import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRegistration from './Components/userRegistration/UserRegistration';
import LandingPage from './Components/landingPage/LandingPage';
// import OtpLogin from './Components/Login/logIn';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/Login" element={<OtpLogin />} /> */}
        {/* <Route path="/" element={<UserRegistration />} /> */}
        <Route path="/" element={<LandingPage />} />

      </Routes>
    </Router>
  );
}

export default App;