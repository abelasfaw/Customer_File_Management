var mongoose = require('mongoose');
const fileTypes = ['RECEIPT', 'AGREEMENT', 'APPLICATION', 'LICENSE', 'OTHERS' ];
const customerSchema = mongoose.Schema({
    type: {
        type: String,
        enum: fileTypes,
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: true
    },
    name: {
        type: String,
        required:true
    },
    size: {
        type: Number,
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'USER'
    },
}, {timestamps: true})
const File = mongoose.model('File', customerSchema);
module.exports = File;