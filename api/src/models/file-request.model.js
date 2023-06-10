const mongoose = require('mongoose');
const states = ['PENDING', 'ACCEPTED', 'DENIED'];
const fileRequestSchema = mongoose.Schema({
    requested_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'USER',
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: true
    },
    status: {
        type: String,
        enum: states,
        default: 'PENDING'
    },
    handledBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'USER',
        default:null
    }
}, {timestamps: true})
const FileRequest = mongoose.model('FileRequest', fileRequestSchema);
module.exports = FileRequest;