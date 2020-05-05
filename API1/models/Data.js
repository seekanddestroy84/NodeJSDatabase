const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    subject: String,
    fromEmail: String,
    phone: String,
    dateCreated: String,
    description: String,
    assigned: [String],
    priority: String,
    complete: String,
    dateCompleted: String,
    department: String,
    comments: [{
        userId: String,
        comment: String,
        dateCreated: String
    }]

});

module.exports = mongoose.model('Data', DataSchema, 'It');