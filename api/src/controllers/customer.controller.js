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
exports.uploadCustomerFile = async (req, res, next) => {
    let newFile = await File.create({
        type: req.params.file_type,
        customer: req.customer._id,
        name:req.files.file[0].filename,
        size: req.files.file[0].size,
        uploadedBy:req.user._id  
    })
    return res.json({
        success: true,
        data: newFile
    })
}
exports.fetchCustomerFileForFileRoomAndAdmin = async (req, res, next) => {
    const parameterSchema = yup.object().shape({
        customer_id: yup.string().required(),
        filename: yup.string().required(),
        file_type: yup.mixed().oneOf(fileTypes).required(),
    })
    await parameterSchema.validate(req.params);
    // await bodySchema.validate(req.body, {abortEarly:false});
    if (!(idChecker.isValidObjectId(req.params.customer_id))){
        throw new ValidationError('Invalid customer id')
    }
    let customer = await Customer.findOne({
        _id: req.params.customer_id
    })
    if (!customer) {
        throw new NotFoundError("Customer with specified id not found")
    }
    let filePath = process.cwd() + `\\files\\customer-${customer._id}\\${req.params.file_type}\\${req.params.filename}`
    if (fs2.existsSync(filePath)){
        //stream file content
        res.writeHead(200, {'content-type':'application/pdf'})
        fs2.createReadStream(filePath).pipe(res);
        
        /*
        read file content and send as a whole
        var data =fs2.readFileSync(filePath);
        res.contentType("application/pdf");
        res.status(200);
        res.send(data);
        */
    }
}
exports.fetchCustomerFile = async (req, res, next) => {
    console.log("Path: ", process.cwd())
    const parameterSchema = yup.object().shape({
        customer_id: yup.string().required(),
        filename: yup.string().required(),
        file_type: yup.mixed().oneOf(fileTypes).required(),
        token: yup.string().required()
    })
    const bodySchema = yup.object().shape({
        file_type: yup.mixed().oneOf(fileTypes).required(),
        token: yup.string().required()
    })
    await parameterSchema.validate(req.params);
    //await bodySchema.validate(req.body, {abortEarly:false});
    if (!(idChecker.isValidObjectId(req.params.customer_id))){
        throw new ValidationError('Invalid customer id')
    }
    let customer = await Customer.findOne({
        _id: req.params.customer_id
    })
    if (!customer) {
        throw new NotFoundError("Customer with specified id not found")
    }
    
    let fileAccess = await FileAccess.findOne({
        token: req.params.token
    })
    if (!fileAccess){
        throw new NotFoundError("File-Access not found")
    }
    console.log("File Access: ", fileAccess)
    const privateKey = await fs.readFile('private_key.pem', 'utf8');
    try {
        var tokenData = jwt.verify(req.params.token, privateKey);
    }
    catch (err) {
        if (err instanceof jwt.TokenExpiredError){
            throw new UnauthorizedError('File Access expired');
        }
        throw new ValidationError("Invalid FileAccess token")
    }
    console.log(req.user._id, tokenData.grantedTo)
    console.log(customer._id, tokenData.customer)
    if (req.user._id != tokenData.grantedTo || customer._id != tokenData.customer){
        throw new UnauthorizedError("Unauthorized access")
    }
    let filePath = process.cwd() + `\\files\\customer-${customer._id}\\${req.params.file_type}\\${req.params.filename}`
    if (fs2.existsSync(filePath)){
        //stream file content
        res.writeHead(200, {'content-type':'application/pdf'})
        fs2.createReadStream(filePath).pipe(res);
        
        /*
        read file content and send as a whole
        var data =fs2.readFileSync(filePath);
        res.contentType("application/pdf");
        res.status(200);
        res.send(data);
        */
    }
}