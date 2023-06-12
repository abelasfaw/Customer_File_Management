const yup = require('yup');
const jwt = require('jsonwebtoken');
const FileRequest = require('../models/file-request.model');
const FileAccess = require('../models/file-access.model');
const Customer = require('../models/customer.model');
const User = require('../models/user.model');
const NotFoundError = require('../error/not-found.error');
const ValidationError = require('../error/validation.error');
const idChecker = require('../utilities/id');
const officeTypes = ['KADASTER', 'LAND-OFFICE','REVENUE','CONSTRUCTION'];
exports.fetchFileAccessByOfficeAccount = async (req, res, next) => {
    let paginationSchema = yup.object().shape({
        page: yup.number().positive(),
        limit: yup.number().positive()
    })
    await paginationSchema.validate(req.query, {abortEarly: false});
    const numberOfFileAccess = await FileAccess.countDocuments({
        grantedTo: req.user._id,
        status: 'ACTIVE'
    });
    let fileAccessQuery = FileAccess.find({
        grantedTo: req.user._id,
        status: 'ACTIVE'
    });
    if (req.query.page && req.query.limit){
        const skip = (req.query.page - 1) * req.query.limit;
        if (numberOfFileAccess > 0 && skip >= numberOfFileAccess){
            throw new NotFoundError("page not found")
        }
        fileAccessQuery = fileAccessQuery.skip(skip).limit(req.query.limit);
    }
    const fileAccess = await fileAccessQuery.populate('customer');  
    return res.json({
        success: true,
        totalFileAccess: numberOfFileAccess,
        results: fileAccess.length,
        data: fileAccess
    })  
}
//changed to soft delete (chaning status from active to deleted) because count is needed for report
exports.deleteFileAccess = async(req, res) => {
    const schema = yup.object().shape({
        ids: yup.array().min(1).required()     
    })
    let deleteCount = 0;
    await schema.validate(req.body, {abortEarly: false});
    const ids = req.body.ids
    for (let index in ids){
        if (!(idChecker.isValidObjectId(ids[index]))){
            throw new ValidationError("Invalid file access id")
        }
        let fileAccess = await FileAccess.findOne({
            _id: ids[index]
        })
        if (!fileAccess) {
            throw new NotFoundError("File access with sepcified id not found")
        }
        //check if user initiating delete has been granted the file access to be deleted
        if (!(fileAccess.grantedTo.equals(req.user._id))) {
            throw new ValidationError("Cannot delete file access")
        }
        fileAccess.status = 'DELETED';
        await fileAccess.save();
        deleteCount+=1
    }
    const response = {
        deleteCount: deleteCount
    }
    return res.json({
        success: true,
        data: response
    })
} 
exports.forwardFileAccess = async(req, res)=>{
    const parameterSchema = yup.object().shape({
        id: yup.string().required()
    })
    const bodySchema = yup.object().shape({
        id: yup.string().required()
    })
    await parameterSchema.validate(req.params);
    await bodySchema.validate(req.body);
    if (!(idChecker.isValidObjectId(req.params.id))){
        throw new ValidationError("Invalid file access id")
    }
    if (!(idChecker.isValidObjectId(req.body.id))){
        throw new ValidationError("Invalid user id")
    }
    const fileAccess = await FileAccess.findOne({
        _id: req.params.id
    })
    if (!fileAccess){
        throw new NotFoundError("File access with specified id not found")
    }
    if (!(fileAccess.grantedTo.equals(req.user._id))){
        throw new ValidationError("Cannot forward file access granted to other user")
    }
    const user = await User.findOne({
        _id: req.body.id
    })
    if (!user) {
        throw new NotFoundError("User with specified id not found")
    }
    if (user.status !== 'ACTIVE') {
        throw new ValidationError("Cannot forward to blocked account")
    }
    console.log(officeTypes.includes(user.type))
    if (!(officeTypes.includes(user.type))){
        throw new ValidationError("Cannot forward to non office account");
    }
    if (user.type !== req.user.type){
        throw new ValidationError("Cannot forward to user in different office")
    }
    fileAccess.forwardedFrom.push(fileAccess.grantedTo);
    fileAccess.grantedTo = user._id;
    await fileAccess.save();
    return res.json({
        success: true,
        data: fileAccess
    })

}