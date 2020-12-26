'use strict';

require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || null;

const isTokenValid = require('../middlewares/verifyToken');

/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
    const newUser = await new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    try {
        await newUser.save();

        return res.json(newUser);
    }
    catch(err) {
        return res.json(err);
    };
});

/**
 * LOGIN
 */
router.post('/login', async(req, res) => {
    // Missing fields in POST request
    if(!req.body.email || !req.body.password) res.json({ missing_field: true, message: 'Missing e-mail or password field.' });

    // Find and get user
    const user = await User.findOne({ email: req.body.email });

    try {
        if(!user) res.json({ user_not_found: true });

        // Validate password
        const isPasswordValid = await user.isPasswordValid(req.body.password);
        if(!isPasswordValid) res.json({ wrong_password: true });

        // Set up payload, options and secret for JSON Web Token
        const payload = {
            userID: user._id,
            username: user.username,
        };
        const options = {
            expiresIn: "1d"
        };
        const token = jwt.sign(payload, secret, options);

        res.json({ token });
    }
    catch(err) {
        return res.json(err);
    }
});

/**
 * PROFILE
 * Made this enpoit just to try out JWT.verify
 */
router.get('/profile', isTokenValid, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    try {
        if(!user) res.status(500).json({ message: 'Error on server' });

        res.json({ user });
    }
    catch(err) {
        res.json({ err });
    }
});

module.exports = router;