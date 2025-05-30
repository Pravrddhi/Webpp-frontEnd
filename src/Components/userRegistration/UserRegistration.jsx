import React, { Component } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './UserRegistration.css';
import jagdhamLogoNoBg from '../Assets/jagdhambNoBg.png';
import OtpModal from './OtpModal';
// import { Link } from 'react-router-dom';

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      middleName: '',
      lastName: '',
      mobileNo: '',
      age: '',
      gender: '',
      instrument: [],
      address: '',
      errors: {},
      isMobileVerified: false,
      showOtpModal: false,
      otp: '',
      reqId: '',
      popupMessage: '',
      showPopup: false,
      showSuccessPopup: false,
      emergencyContact: '',
      mobileError: '',
      isResendDisabled: true,
      resendTimerId: null,
      sendOtpFlag: false,
    };
  }

  componentDidMount() {
    window.configuration = {
      widgetId: '35646b737343323738353130',
      tokenAuth: '446603TCnuMImrwXIQ67f96874P1',
      exposeMethods: true,
      success: (data) => console.log('Global config success:', data),
      failure: (error) => console.log('Global config failure:', error),
    };

    if (window.initSendOTP) {
      window.initSendOTP(window.configuration);
    } else {
      const script = document.createElement('script');
      script.src = 'https://verify.msg91.com/otp-provider.js';
      script.type = 'text/javascript';
      script.onload = () => window.initSendOTP(window.configuration);
      document.body.appendChild(script);
    }
  }

  showPopup = (message) => {
    this.setState({ popupMessage: message, showPopup: true });
  };

  closePopup = () => {
    this.setState({ popupMessage: '', showPopup: false });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const nameRegex = /^[A-Za-z]+$/;      //regex to validate fname,mname and lname

    if (['firstName', 'middleName', 'lastName'].includes(name)) {
      if (value === '' || nameRegex.test(value)) {
        this.setState({ [name]: value });
      }
    } else {
      this.setState({ [name]: value });
    }
  };

  handleMultiSelectChange = (e) => {
    this.setState({ instrument: e.value });
  };

  checkIfUserExists = async (mobileNo) => {
    try {
      const response = await fetch('https://gli2l3bb50.execute-api.eu-north-1.amazonaws.com/existing_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNo }),
      });
      const data = await response.json();
      this.setState({ sendOtpFlag: true });
      return data.status;
    } catch (error) {
      this.showPopup('Error checking mobile number.');
      return false;
    }
  };

  sendOtp = (identifier) => {
    window.sendOtp(
      identifier,
      (data) => {
        console.log('OTP sent successfully:', data);
        this.setState({ showOtpModal: true, reqId: data.reqId, isResendDisabled: true });
        const timerId = setTimeout(() => {
          this.setState({ isResendDisabled: false });
        }, 900000);
        if (this.state.resendTimerId) {
          clearTimeout(this.state.resendTimerId);
        }

        this.setState({ resendTimerId: timerId });
      },
      (error) => {
        console.log('OTP send error:', error);
        this.showPopup('Failed to send OTP.');
      }
    );
  };

  handleVerifyClick = async () => {
    const {
      firstName, lastName, mobileNo, age, gender,
      instrument, address, emergencyContact
    } = this.state;

    // Early validation check before sending OTP
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !mobileNo.trim() ||
      !age.trim() ||
      !gender.trim() ||
      instrument.length === 0 ||
      !address.trim() ||
      !emergencyContact.trim()
    ) {
      this.showPopup('Please fill all details.');
      return;
    } if (!mobileNo || mobileNo.length < 10) {
      this.setState({ mobileError: 'Enter a valid mobile number.' });
      return;
    } else {
      this.setState({ mobileError: '' }); // clear error if valid
    }

    if (!mobileNo || mobileNo.length < 10) {
      this.setState({ mobileError: 'Enter a valid mobile number.' });
      return;
    } else {
      this.setState({ mobileError: '' }); // clear error if valid
    }

    if (typeof window.sendOtp !== 'function') {
      this.showPopup('OTP methods not loaded yet.');
      return;
    }

    const exists = await this.checkIfUserExists(mobileNo);
    if (exists) {
      this.showPopup('Mobile number is already registered.');
      return;
    } else {
      const identifier = `91${mobileNo}`;
      this.sendOtp(identifier);
    } 
  };

  // Function to handle OTP submission and verification along with rgistering the user
  // and showing success message
  handleOtpSubmit = () => {
    const { otp, reqId } = this.state;

    if (!otp) {
      this.showPopup('Enter OTP first.');
      return;
    }

    if (typeof window.verifyOtp !== 'function') {
      this.showPopup('OTP verification method not loaded.');
      return;
    }

    window.verifyOtp(
      otp,
      (data) => {
        console.log('OTP verified:', data, this.state.otp);
        this.handleSubmit(); // Call the handleSubmit function to register the user
        this.setState({ showOtpModal: false });
      },
      (error) => {
        console.log('Verification error:', error);
        this.showPopup('Incorrect OTP.');
      },
      reqId
    );
  };

  handleRetryOtp = () => {
    const { reqId } = this.state;

    if (typeof window.retryOtp !== 'function') {
      this.showPopup('Retry OTP method not loaded.');
      return;
    }

    window.retryOtp(
      '11',
      (data) => {
        console.log('Resent OTP:', data);
        this.showPopup('OTP resent successfully.');
      },
      (error) => {
        console.log('Retry error:', error);
        this.showPopup('Failed to resend OTP.');
      },
      reqId
    );
  };

  handleSubmit = async (e) => {
    if (this.validateForm()) {
      const {
        firstName, middleName, lastName, mobileNo, age,
        gender, instrument, address, emergencyContact, experiencePathak, pathakDuration
      } = this.state;

      try {
        const response = await fetch('https://gli2l3bb50.execute-api.eu-north-1.amazonaws.com/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            mobile_number: mobileNo,
            age: age,
            gender: gender,
            instrument: instrument,
            address: address,
            emergency_contact: emergencyContact,
            experience_pathak_name: experiencePathak,
            experience_duration: pathakDuration,
          }),
        });

        console.log("response:", response)
        if (!response.ok) {
          const data = await response.json();
          this.showPopup(data.message || 'Registration failed. Please try again.');
          return;
        }

        const successLink =
          gender === 'FEMALE'
            ? 'https://example.com/female-success'
            : gender === 'MALE'
              ? 'https://example.com/male-success'
              : '';

        this.setState({ showSuccessPopup: true, successLink });

      } catch (error) {
        console.error('Registration error:', error);
        this.showPopup('Something went wrong. Please try again later.');
      }
    }
  };


  validateForm = () => {
    const errors = {};
    const { firstName, lastName, mobileNo, age, gender, instrument, address, emergencyContact } = this.state;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
      errors.firstName = 'First name should contain only letters with no spaces';
    }
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!mobileNo.trim()) errors.mobileNo = 'Mobile number is required';
    if (!emergencyContact.trim()) errors.emergencyContact = 'Emergency contact is required';
    if (!age.trim()) {
      errors.age = 'Age is required';
    } else if (!/^\d+$/.test(age)) {
      errors.age = 'Age must be a valid number';
    } else if (parseInt(age, 10) < 5 || parseInt(age, 10) > 120) {
      errors.age = 'Age must be between 5 and 120';
    }
    if (!gender.trim()) errors.gender = 'Gender is required';
    if (instrument.length === 0) errors.instrument = 'At least one instrument must be selected';
    if (!address.trim()) errors.address = 'Address is required';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  render() {
    const {
      errors, showOtpModal, otp, instrument,
      showPopup, popupMessage, showSuccessPopup
    } = this.state;

    return (
      <div className="form-container">
        <form id="reg-form" className="registration-form">
          <div style={{ backgroundColor: '#860903', padding: '1rem', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
            <img src={jagdhamLogoNoBg} alt="Registration Banner" className="registration-image" />
          </div>
          <div style={{
            border: '2px solid maroon',
            padding: '1rem',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0'
          }}>
            <h2>Registration Form</h2>

            <div className="row">
              <div className="form-group">
                <input type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} pattern="[A-Za-z]+" onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
                }} />
                <div className="error">{errors.firstName}</div>
              </div>
              <div className="form-group">
                <input type="text" name="middleName" placeholder="Middle Name" onChange={this.handleChange} pattern="[A-Za-z]+" onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
                }} />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <input type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} pattern="[A-Za-z]+" onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
                }} />
                <div className="error">{errors.lastName}</div>
              </div>
              <div className="form-group">
                <input type="number" name="age" placeholder="Age" onChange={this.handleChange} onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  if (parseInt(e.target.value, 10) > 120) e.target.value = '120';
                  if (parseInt(e.target.value, 10) < 5) e.target.value = '5';
                }} />
                <div className="error">{errors.age}</div>
              </div>
            </div>

            <div className="row">
              <div className="form-group" style={{ flex: 2 }}>
                <select name="gender" onChange={this.handleChange}>
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <div className="error">{errors.gender}</div>
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <MultiSelect
                  style={{ backgroundColor: '#ece5e5' }}
                  value={instrument}
                  options={['Dhol', 'Tasha', 'Dhwaj']}
                  onChange={this.handleMultiSelectChange}
                  placeholder="Select Instrument"
                />
                <div className="error">{errors.instrument}</div>
              </div>
            </div>

            <div className="row">
              <div className="form-group" style={{ flex: 2 }}>
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="Mobile No"
                  onChange={this.handleChange}
                  maxLength={10}
                  disabled={this.state.isMobileVerified}
                />
                {this.state.mobileError && (
                  <div style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>
                    {this.state.mobileError}
                  </div>
                )}
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <input
                  type="tel"
                  name="emergencyContact"
                  placeholder="Emergency Contact No"
                  onChange={this.handleChange}
                  maxLength={10}
                />
                <div className="error">{errors.emergencyContact}</div>
              </div>
              {/* <div className="form-group" style={{ alignContent: "auto", marginTop: '6px' }}>
                <button
                  type="button"
                  className="verify-btn"
                  onClick={this.handleVerifyClick}
                  disabled={isMobileVerified}
                >
                  {isMobileVerified ? 'Verified' : 'Verify'}
                </button>
              </div> */}
            </div>
            <div className="form-group" style={{ marginTop: '10px' }}>
              <textarea name="address" onChange={this.handleChange} placeholder="Address"></textarea>
              <div className="error">{errors.address}</div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={this.state.hasExperience}
                  onChange={(e) => this.setState({ hasExperience: e.target.checked })}
                />
                &nbsp; I have experience
              </label>
            </div>

            {this.state.hasExperience && (
              <div className="row" style={{ marginTop: '10px' }}>
                <div className="form-group">
                  <input
                    type="text"
                    name="experiencePathak"
                    placeholder="Name of previous pathak"
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="pathakDuration"
                    placeholder="pathak Duration e.g., 2.5, 0.5, 4"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ alignContent: "auto", marginTop: '6px' }}>
              <button
                type="button"
                className="verify-btn"
                onClick={this.handleVerifyClick}
              >
                Register
              </button>
            </div>

            {/* <button type="button" onClick={this.handleVerifyClick}>Register</button> */}

            {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>
              Already registered?{' '}
              <Link to="/login" style={{ color: '#800000', textDecoration: 'underline' }}>
                Click here to Log in
              </Link>
            </p>
          </div> */}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span style={{ color: '#800000' }}>
                If registration fail Contact: 9767704126
              </span>
            </div>
          </div></form >

        {showOtpModal && (
          <OtpModal
            otp={otp}
            onChange={(e) => this.setState({ otp: e.target.value })}
            onSubmit={this.handleOtpSubmit}
            onCancel={() => this.setState({ showOtpModal: false })}
            onRetry={this.handleRetryOtp}
          />
        )
        }

        {
          showPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <p>{popupMessage}</p>
                <button onClick={this.closePopup}>OK</button>
              </div>
            </div>
          )
        }

        {
          showSuccessPopup && (
            <div className="popup-overlay">
              <div className="popup-box large">
                <h3>Registration Successful!</h3>
                {this.state.gender === 'FEMALE' && (
                  <p style={{ fontWeight: 'bold', marginTop: '10px', color: '#e91e63', fontSize: '15px' }}>
                    Note: Female vadaks have a separate group. Jagdhamb prioritizes your privacy.
                  </p>
                )}

                <button
                  className=''
                  href={this.state.successLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: '15px', color: '#FFFFFF' }}
                >
                  Join WhatsApp Group
                </button>
              </div>
            </div>
          )
        }
      </div >
    );
  }
}

export default UserRegistration;
