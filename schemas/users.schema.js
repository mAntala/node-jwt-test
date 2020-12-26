'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const slug = require('mongoose-slug-generator');
const slugOptions = {
    separator: ".",
};

mongoose.plugin(slug, slugOptions);

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'field-is-required-first-name']
    },
    lastName: {
        type: String,
        required: [true, 'field-is-required-last-name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'field-is-required-email'],
        validate: {
            validator: function(email) {
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: props => `wrong-format-${props.value}`
        }
    },
    username: {
        type: String,
        slug: ['firstName', 'lastName']
    },
    password: {
        type: String,
        required: [true, 'field-is-required-password']
    }
});

userSchema.pre(
    'save',
    async function(next) {
        const user = this;
        const hashedPassword = await bcrypt.hash(user.password, 10);

        user.password = hashedPassword;
        next();
    }
);

userSchema.methods.isPasswordValid = async function(password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid;
};

module.exports = userSchema;