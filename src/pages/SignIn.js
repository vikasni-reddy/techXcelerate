import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import './Auth.css';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (username.trim() === '') {
            setUsernameError('Username is required');
            isValid = false;
        } else if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            isValid = false;
        } else if (!username.match(/^[a-zA-Z0-9]+$/)) {
            setUsernameError('Username can only contain letters and numbers');
            isValid = false;
        } else {
            setUsernameError('');
        }

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
                const response = await axios.post('http://localhost:5000/api/auth/signin', { username, password });
                console.log('Sign in successful:', response.data);
                // Redirect to home page
                navigate('/home');
            } catch (error) {
                console.error('Error signing in:', error);
            }
        }
    };

    return (
        <div className="content">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <div className="error">{usernameError}</div>
                <div className="password-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="eye-icon" onClick={toggleShowPassword}>
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </div>
                </div>
                <div className="error">{passwordError}</div>
                <button type="submit">Sign In</button>
                <p className="account" align="center">
                    Don't have an account? <a className="anchor" href="/signup">Sign up</a>
                </p>
                <p className="account" align="center">
                    Forgot your password? <a className="anchor" href="/forgot-password">Reset Password</a>
                </p>
            </form>
        </div>
    );
};

export default SignIn;