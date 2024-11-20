const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/index'); // Import your user model

// const Register = async (req, res) => {

//     const { phoneNumber, password, deviceID } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Store user in DB
//     const newUser = await Users.create({ phoneNumber, passwordHash: hashedPassword, deviceID });
//     res.status(201).json({ message: 'User registered', userId: newUser.id });

// };

// Login endpoint

const Login = async (req, res) => {
    try {
        const { phoneNumber, password, deviceID } = req.body;

        // Ensure all required fields are provided
        if (!phoneNumber || !password || !deviceID) {
            return res.status(400).json({ message: 'Please provide phone number, password, and device ID' });
        }

        // Find user by phone number
        const user = await Users.findOne({ where: { phoneNumber }, raw: true });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Check if the device ID matches
        if (user.deviceID !== deviceID) {
            return res.status(403).json({ message: 'Login from this device is not allowed' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Set session data for the user
        req.session.user = user;
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

// // Middleware to protect routes
// const Authenticate = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) return res.sendStatus(403);

//     jwt.verify(token, Prodc, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };

// // Protected route example
// const Protected = (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// };

module.exports = { Login }