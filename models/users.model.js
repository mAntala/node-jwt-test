'use strict';

const mongoose = require('mongoose');
const userSchema = require('../schemas/users.schema');

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;