import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import './Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (password.trim() === '') {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            isValid = false;
        } else if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)) {
            setPasswordError('Password must contain at least one letter, one number, and one special character');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/reset-password', { email, password });
                console.log('Password reset successful:', response.data);
                // Redirect to sign-in page
                navigate('/signin');
            } catch (error) {
                console.error('Error resetting password:', error);
            }
        }
    };

    return (
        <div className="content">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <div className="password-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="eye-icon" onClick={toggleShowPassword}>
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </div>
                </div>
                <div className="error">{passwordError}</div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;