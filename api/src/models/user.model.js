const mongoose = require('mongoose');
const userTypes = ['ADMIN', 'FILE-ROOM','KADASTER', 'LAND-OFFICE','REVENUE','CONSTRUCTION'];
const userSchema = mongoose.Schema({
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: userTypes
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
    },
}, {timestamps: true});
const USER = mongoose.model('USER', userSchema);
module.exports = USER;