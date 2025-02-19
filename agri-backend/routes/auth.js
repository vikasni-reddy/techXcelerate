const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/signup', async (req, res) => {
    const { username, password, email, mobile } = req.body;

    try {
        const user = new User({ username, password, email, mobile });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).send('Error signing in');
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('OTP sent');
    } catch (error) {
        res.status(400).send('Error sending OTP');
    }
});

router.post('/otp-verification', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email, otp });
        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).send('OTP is invalid or has expired');
        }

        res.status(200).send('OTP verified');
    } catch (error) {
        res.status(400).send('Error verifying OTP');
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        user.password = password;
        user.otp = undefined;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send('Password reset successfully');
    } catch (error) {
        res.status(400).send('Error resetting password');
    }
});

module.exports = router;