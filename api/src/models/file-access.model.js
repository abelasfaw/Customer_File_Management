const mongoose = require('mongoose');
const fileAccessSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    grantedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'USER',
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    },
    forwardedFrom: {
        type: [mongoose.Schema.ObjectId],
        ref: 'USER',
        default: []
    }
}, {timestamps: true})
const FileAccess = mongoose.model('FileAccess', fileAccessSchema);
module.exports = FileAccess;