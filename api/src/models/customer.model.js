var mongoose = require('mongoose');
const customerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    registeredBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'USER',
        required: true
    },
}, {timestamps: true});
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
