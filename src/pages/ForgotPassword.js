import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (email.trim() === '') {
            setEmailError('Email is required');
            isValid = false;
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setEmailError('Invalid email format');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (isValid) {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
                console.log('Forgot password email sent:', response.data);
                // Redirect to OTP verification page
                navigate('/otp-verification', { state: { email } });
            } catch (error) {
                console.error('Error sending forgot password email:', error);
            }
        }
    };

    return (
        <div className="content">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="error">{emailError}</div>
                <button type="submit">Submit</button>
                <p className="account" align="center">
                    Remembered your password? <a className="anchor" href="/signin">Sign In</a>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;