import React, { Component } from 'react';
import './Navbar.css';
import jagdhanbNoBG from '../Assets/jagdhambNoBg.png';


class Navbar extends Component {
    render() {
        return (
            <nav className="navbar">
                <div className="logo-container">
                    <img src={jagdhanbNoBG} alt="Jagdham Logo" className="landing-image" />
                </div>
                <ul className="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Login</a></li>
                    <li><a href="#">User Registration</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;
