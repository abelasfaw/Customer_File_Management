const yup = require('yup');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const fs2= require('fs');
const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const File = require('../models/file.model');
const FileAccess = require('../models/file-access.model');
const ValidationError = require('../error/validation.error');
const NotFoundError = require('../error/not-found.error');
const UnauthorizedError = require('../error/unauthorized.error');
const CustomerHelper = require('../utilities/customer');
const idChecker = require('../utilities/id');
const fileTypes = ['RECEIPT', 'AGREEMENT', 'APPLICATION', 'LICENSE', 'OTHERS' ];
exports.addCustomer = async (req, res, next) => {
    let schema = yup.object().shape({
        firstName: yup.string().required(),
        middleName: yup.string().required(),
        lastName: yup.string().required(),
        phoneNumber: yup.string().length(10).required(),
        registrationNumber: yup.string().required()
    })
    await schema.validate(req.body, {abortEarly:false});
    //check if there is a customer with the same registrationNumber
    let customer = await Customer.findOne({
        registrationNumber: req.body.registrationNumber
    })
    if (customer) {
        throw new ValidationError("Customer with the same registration number already exits")
    }
    //set 
    req.body.registeredBy = req.user._id;
    let newCustomer = await CustomerHelper.createNewCustomer(req.body, req.user._id);
    await CustomerHelper.setupCustomerDirectory(newCustomer._id);
    Object.defineProperty(newCustomer, 'files', [])
    console.log(newCustomer);
    return res.json({
        success: true,
        data: newCustomer
    })
}
exports.editCustomer = async (req, res, next) => {
    let schema = yup.object().shape({
        firstName: yup.string().required(),
        middleName: yup.string().required(),
        lastName: yup.string().required(),
        phoneNumber: yup.string().length(10).required(),
        registrationNumber: yup.string().required()
    })
    if (!req.params.id) {
        throw new ValidationError('Customer id required')
    }
    if (!(idChecker.isValidObjectId(req.params.id))) {
        throw new ValidationError('Invalid customer id')
    }
    let customer = await Customer.findOne({
        _id: req.params.id    
    })
    if (!customer) {
        throw new NotFoundError('Customer with specified id not found')
    }
    await schema.validate(req.body, {abortEarly:false});
    customer.firstName = req.body.firstName;
    customer.middleName = req.body.middleName;
    customer.lastName = req.body.lastName;
    customer.phoneNumber = req.body.phoneNumber;
    customer.registrationNumber = req.body.registrationNumber;
    await customer.save();
    return res.json({
        success: true,
        data: customer
    })

}
exports.fetchSingleCustomer = async (req, res, next) => {
    if (!req.params.id) {
        throw new ValidationError('Customer id required')
    }
    if (!(idChecker.isValidObjectId(req.params.id))) {
        throw new ValidationError('Invalid customer id')
    }
    let customerDetails = await Customer.aggregate(
      [
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(req.params.id)
          }
        }, {
          '$lookup': {
            'from': 'files', 
            'localField': '_id', 
            'foreignField': 'customer', 
            'as': 'files'
          }
        }
      ]
    )
    if (customerDetails.length == 0) {
        throw new NotFoundError('Customer with specified id not found')
    }
    return res.json({
        success:true,
        data: customerDetails
    })
}