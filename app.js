'use strict';

require('dotenv').config();

/**
 * App settings
 */
const express = require('express');
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Database settings
 */
const mongoose = require('mongoose');
const dbCluster = process.env.DB_CLUST;
const dbPassword = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

mongoose.connect(
    `mongodb+srv://admin:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('connected to Mongo'))
.catch(error => {
    return new Error(error);
});

/**
 * Router
 */
const userRoutes = require('./routes/users.route');

app.use(userRoutes);
app.get('/', (req, res) => {
    res.json({
        'api': true
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));