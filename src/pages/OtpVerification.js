import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (otp.trim() === '') {
            setOtpError('OTP is required');
            isValid = false;
        } else if (!otp.match(/^[0-9]{6}$/)) {
            setOtpError('Invalid OTP format');
            isValid = false;
        } else {
            setOtpError('');
        }

        if (isValid) {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/otp-verification', { email, otp });
                console.log('OTP verified:', response.data);
                // Redirect to reset password page
                navigate('/reset-password', { state: { email } });
            } catch (error) {
                console.error('Error verifying OTP:', error);
            }
        }
    };

    return (
        <div className="content">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>OTP Verification</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <div className="error">{otpError}</div>
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default OtpVerification;