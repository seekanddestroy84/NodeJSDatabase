// JavaScript source code

const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    email: String,
    role: String,
    password: String,
    department: String,
    phone: String,
    ext: String,
    firstName: String,
    lastName: String,
    dateCreated: String,
    userCreated: String,
    dateUpdated: String,
    userUpdated: String,
    active: Boolean
});

module.exports = mongoose.model('Users', UsersSchema, 'Users');
