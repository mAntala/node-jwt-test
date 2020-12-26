'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');

/**
 * @name isTokenValid
 * @description Validate token and return user data from token in request header.
 */
const isTokenValid = (req, res, next) => {
    const headers = req.headers;
    const authHeaders = headers['authorization'];

    if(!authHeaders || authHeaders.indexOf('Bearer') < 0) return res.status(401).json({ missing_auth_token: true })

    const token = authHeaders.split(' ')[1];
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);

    req.user = isTokenValid;

    next();
};

module.exports = isTokenValid;