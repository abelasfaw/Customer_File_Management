const yup = require('yup');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const FileRequest = require('../models/file-request.model');
const FileAccess = require('../models/file-access.model');
const Customer = require('../models/customer.model');
const NotFoundError = require('../error/not-found.error');
const ValidationError = require('../error/validation.error');
const idChecker = require('../utilities/id');
const states = ['PENDING', 'ACCEPTED', 'DENIED', 'ALL'];
const officeTypes = ['KADASTER', 'LAND-OFFICE','REVENUE','CONSTRUCTION'];
exports.createFileRequest = async (req, res) =>{
    let schema = yup.object().shape({
        customer_id: yup.string().required()
    })
    await schema.validate(req.body, {abortEarly:false});
    let customer = await Customer.findOne({
        _id: req.body.customer_id
    })
    if (!customer) {
        throw new NotFoundError('Customer with specified id not found')
    }
    /*
    check if there is a pending file request by the same office account for the same customer
    */
    let existingFileRequest = await FileRequest.findOne({
        requested_by: req.user._id,
        customer: customer._id,
        status: 'PENDING'
    })
    if (existingFileRequest){
        throw new ValidationError("You have a pending File Request")
    }
    let fileRequest = await FileRequest.create({
        requested_by:req.user._id,
        customer: customer._id,
        status: 'PENDING' 
    })
    return res.json({
        success:true,
        data: fileRequest
    })
}
//fetch file requests for admin or file-room accounts, filter requests state by state parameter 
exports.fetchFileRequests = async (req, res, next) => {
    let schema = yup.object().shape({
        state: yup.mixed().oneOf(states).required()
    });
    const paginationSchema = yup.object().shape({
        page: yup.number().positive(),
        limit: yup.number().positive()
    })
    await schema.validate(req.params, {abortEarly:false});
    await paginationSchema.validate(req.query, {abortEarly:false});
    const filter = req.params.state === 'ALL'? {} :{status: req.params.state};
    const numberOfFileRequests = await FileRequest.countDocuments(filter);
    let fileRequestsQuery = FileRequest.find(filter)
    if (req.query.page && req.query.limit){
        const skip = (req.query.page - 1) * req.query.limit;
        if (numberOfFileRequests > 0 && skip >= numberOfFileRequests) {
            throw new NotFoundError("Page not found")
        }
        fileRequestsQuery = fileRequestsQuery.skip(skip).limit(req.query.limit);
    }
    let fileRequests = await fileRequestsQuery.populate('requested_by', '-password -status -createdAt -updatedAt -__v').populate('customer' , '-createdAt -updatedAt -__v');
    return res.json({
        success: true,
        totalFileRequests: numberOfFileRequests,
        results:fileRequests.length,
        data: fileRequests
    })
}
//fetch file requests by a single office accounts
exports.fetchFileRequestsByOfficeAccount = async (req, res, next) => {
    const schema = yup.object().shape({
        state: yup.mixed().oneOf(states).required()
    });
    const paginationSchema = yup.object().shape({
        page: yup.number().positive(),
        limit: yup.number().positive()
    })
    await schema.validate(req.params, {abortEarly:false});
    await paginationSchema.validate(req.query, {abortEarly:false});
    const filter = req.params.state === 'ALL'? {requested_by:req.user._id} :{requested_by:req.user._id, status: req.params.state};
    const numberOfFileRequests = await FileRequest.countDocuments(filter) 
    let fileRequestsQuery = FileRequest.find(filter);
    if (req.query.page && req.query.limit) {
        const skip = (req.query.page - 1) * req.query.limit
        if (numberOfFileRequests > 0 && skip >= numberOfFileRequests){
            throw new NotFoundError("Page not found")
        }
        fileRequestsQuery = fileRequestsQuery.skip(skip).limit(req.query.limit);
    }
    const fileRequests = await fileRequestsQuery.populate('requested_by', '-password -status -createdAt -updatedAt -__v').populate('customer' , '-createdAt -updatedAt -__v');
    return res.json({
        success: true,
        totalFileRequests: numberOfFileRequests,
        results: fileRequests.length,
        data: fileRequests
    })
}

//accept file request
exports.acceptFileRequest = async (req, res, next) => {
    let schema = yup.object().shape({
        fileRequest_id: yup.string().required()
    })
    await schema.validate(req.params, {abortEarly:false});
    if (!(idChecker.isValidObjectId(req.params.fileRequest_id))) {
        throw new ValidationError('Invalid File-Request id')
    }
    let fileRequest = await FileRequest.findOne({
        _id: req.params.fileRequest_id
    })
    if (!fileRequest) {
        throw new NotFoundError('File-Request with specified id not found')
    }
    if (fileRequest.status !== 'PENDING') {
        throw new ValidationError("File-Request has already been processed")
    }
    fileRequest.status = 'ACCEPTED';
    fileRequest.handledBy = req.user._id;
    const privateKey = await fs.readFile('private_key.pem', 'utf8');
    let fileAccessToken = jwt.sign({
        customer: fileRequest.customer,
        grantedTo: fileRequest.requested_by
    }, privateKey, {algorithm:'PS256',expiresIn: 10800});
    
    let fileAccess = await FileAccess.create({
        customer: fileRequest.customer,
        grantedTo: fileRequest.requested_by,
        token: fileAccessToken
    })
    await fileRequest.save()
    return res.json({
        success: true,
        data: fileRequest,
    })
}
//deny file request
exports.denyFileRequest = async (req, res, next) => {
    let schema = yup.object().shape({
        fileRequest_id: yup.string().required()
    })
    await schema.validate(req.params, {abortEarly:false});
    console.log(req.params.fileRequest_id)
    if (!(idChecker.isValidObjectId(req.params.fileRequest_id))) {
        throw new ValidationError('Invalid File-Request id')
    }
    let fileRequest = await FileRequest.findOne({
        _id: req.params.fileRequest_id
    })
    if (!fileRequest) {
        throw new NotFoundError('File-Request with specified id not found')
    }
    console.log(fileRequest)
    if (fileRequest.status !== 'PENDING') {
        throw new ValidationError("File-Request has already been processed")
    }
    fileRequest.status = 'DENIED';
    fileRequest.handledBy = req.user._id;
    await fileRequest.save()
    return res.json({
        success: true,
        data: fileRequest
    })
}