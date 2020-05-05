const mongoose = require('mongoose');

const MemosSchema = mongoose.Schema({
    title: String,
    content: String,
    dateCreated: String,
    media: [Object],
    archived: Boolean,
    department: String
});

module.exports = mongoose.model('Memos', MemosSchema, 'Memos');