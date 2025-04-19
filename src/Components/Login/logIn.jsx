import React, { Component } from 'react';
import axios from 'axios';
import './logIn.css';  // Import the CSS file
import { Link } from 'react-router-dom';
import jagdhambImage from '../Assets/jagdhamb.jpg';

class OtpLogin extends Component {
    state = {
        mobile: '',
        otp: '',
        isOtpSent: false,
        isLoggedIn: false,
        showPopup: false,
        popupMessage: '',
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            this.setState({ isLoggedIn: true });
        }
    }

    checkIfUserExists = async (mobileNo) => {
        try {
            const response = await fetch('https://gli2l3bb50.execute-api.eu-north-1.amazonaws.com/existing_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobileNo }),
            });
            const data = await response.json();
            return data.exists;
        } catch (error) {
            this.setState({ popupMessage: 'Error checking mobile number.', showPopup: true });
            return false;
        }
    };

    handleSendOtp = async () => {
        const { mobile } = this.state;

        const exists = await this.checkIfUserExists(mobile);

        if (!exists) {
            this.setState({ popupMessage: 'Mobile number not registered. Please register to continue.', showPopup: true });
            return;
        }

        try {
            await axios.post('http://localhost:8000/send-otp/', { mobile });
            this.setState({ isOtpSent: true });
        } catch (error) {
            this.setState({ popupMessage: 'Failed to send OTP.', showPopup: true });
        }
    };

    handleVerifyOtp = async () => {
        const { mobile, otp } = this.state;

        try {
            const res = await axios.post('http://localhost:8000/verify-otp/', { mobile, otp });

            const token = res.data.token.access;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            this.setState({ isLoggedIn: true, popupMessage: 'Logged in successfully!', showPopup: true });
        } catch (error) {
            this.setState({ popupMessage: 'OTP verification failed.', showPopup: true });
        }
    };

    handleLogout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        this.setState({
            mobile: '',
            otp: '',
            isOtpSent: false,
            isLoggedIn: false,
            popupMessage: 'Logged out successfully.',
            showPopup: true,
        });
    };

    closePopup = () => {
        this.setState({ showPopup: false, popupMessage: '' });
    };

    render() {
        const { mobile, otp, isOtpSent, isLoggedIn, popupMessage, showPopup } = this.state;

        return (
            <div className="login-container">
                <form id="reg-form" className="login-form" onSubmit={(e) => e.preventDefault()}>
                    <img src={jagdhambImage} alt="Registration Banner" className="registration-image" />
                    <h2>Login</h2>

                    {!isLoggedIn ? (
                        <>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <input
                                    type="tel"
                                    placeholder="Enter Mobile Number"
                                    style={{ marginRight: '20px' }}
                                    value={mobile}
                                    onChange={(e) => this.setState({ mobile: e.target.value })}
                                />

                                {!isOtpSent ? (
                                    <button type="button" onClick={this.handleSendOtp}>Send OTP</button>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => this.setState({ otp: e.target.value })}
                                            style={{ marginLeft: '10px', marginRight: '10px' }}
                                        />
                                        <button type="button" onClick={this.handleVerifyOtp}>Verify OTP</button>
                                    </>
                                )}
                            </div>


                            <div style={{ textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={this.handleVerifyOtp}
                                    disabled={otp.trim() === ''}
                                    style={{
                                        backgroundColor: otp.trim() === '' ? '#ccc' : '#800000',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: otp.trim() === '' ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Login
                                </button>
                            </div>
                        </>
                    ) : (
                        <button onClick={this.handleLogout}>Logout</button>
                    )}

                    {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p>
                            Not registered?{' '}
                            <Link to="/" style={{ color: '#800000', textDecoration: 'underline' }}>
                                Click here to register
                            </Link>
                        </p>
                    </div> */}

                    {/* 🔔 Popup Modal */}
                    {showPopup && (
                        <div className="overlay">
                            <div className="popup">
                                <p>{popupMessage}</p>
                                <button onClick={this.closePopup} className="closeButton">OK</button>
                            </div>
                        </div>
                    )}
                </form >
            </div>


        );
    }

}

export default OtpLogin;
