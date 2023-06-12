const yup = require('yup');
const argon2 = require('argon2');
const User = require('../models/user.model');
const ValidationError = require('../error/validation.error');
const NotFoundError = require('../error/not-found.error');
const UnauthorizedError = require('../error/unauthorized.error');
const response = require('../utilities/response');
const idChecker = require('../utilities/id');
const userTypes = ['ADMIN', 'FILE-ROOM','KADASTER', 'LAND-OFFICE','REVENUE','CONSTRUCTION'];
const officeTypes = ['KADASTER', 'LAND-OFFICE','REVENUE','CONSTRUCTION'];
//Block user
exports.blockUser = async (req, res, next) => {
    if (!req.params.id) {
        throw new ValidationError('User id required')
    }
    if (!(idChecker.isValidObjectId(req.params.id))) {
        throw new ValidationError('Invalid user id')
    }
    let user = await User.findOne({
        _id: req.params.id
    })
    if (!user) {
        throw new NotFoundError('User with specified id not found')
    }
    if (user.status === 'ACTIVE') {
        user.status = 'BLOCKED';
        await user.save();
    }
    return res.json({
        success: true,
        data: user
    })
}
//Unblock user
exports.activateUser = async (req, res, next) => {
    if (!req.params.id) {
        throw new ValidationError('User id required')
    }
    if (!(idChecker.isValidObjectId(req.params.id))) {
        throw new ValidationError('Invalid user id')
    }
    let user = await User.findOne({
        _id: req.params.id
    })
    if (!user) {
        throw new NotFoundError('User with specified id not found')
    }
    if (user.status === 'BLOCKED') {
        user.status = 'ACTIVE';
        await user.save();
    }
    return res.json({
        success: true,
        data: user
    })
}
//create user
exports.createUser = async(req, res, next)=>{
    let schema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        username: yup.string().required(),
        password: yup.string().required(),
        type: yup.mixed().oneOf(userTypes).required(),
    })
    await schema.validate(req.body, {abortEarly:false});
    let user = await User.findOne({
        username: req.body.username
    })
    if (user) {
        throw new ValidationError('user with specified username exists')
    }
    else {
        let passwordHash = await argon2.hash(req.body.password);
        let user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,       
            username: req.body.username,
            password: passwordHash,
            type: req.body.type,
            status: 'ACTIVE'
        })
        return res.json({
            success: true,
            data: response.removePassword(user)
        })
    }

}
exports.fetchAllUsers = async(req, res) => {
    let paginationSchema = yup.object().shape({
        page: yup.number().positive(),
        limit: yup.number().positive()
    })
    await paginationSchema.validate(req.query, {abortEarly: false});
    const numberOfUsers = await User.countDocuments({});
    let usersQuery = User.find({
    }, "-password");
    if (req.query.page && req.query.limit){
        const skip = (req.query.page - 1) * req.query.limit;
        if (numberOfUsers > 0 && skip >= numberOfUsers){
            throw new NotFoundError("page not found")
        }
        usersQuery = usersQuery.skip(skip).limit(req.query.limit);
    }
    const users = await usersQuery;  
    return res.json({
        success: true,
        totalUsers: numberOfUsers,
        results: users.length,
        data: users
    })  
}
//fetchs other users in the same office
exports.fetchUsersInSingleOffice = async(req, res) => {
    let paginationSchema = yup.object().shape({
        page: yup.number().positive(),
        limit: yup.number().positive()
    })
    let parameterSchema = yup.object().shape({
        office: yup.mixed().oneOf(officeTypes).required()
    })
    await paginationSchema.validate(req.query, {abortEarly: false});
    await parameterSchema.validate(req.params);
    console.log(`user:${req.user.type}, param: ${req.params.office}`);
    if (req.user.type !== req.params.office) {
        console.log("Trying to list users in different office")
        throw new ValidationError("Cannot fetch users in different office")
    }
    //exclude the requesting user to get other users in the same office
    const numberOfUsers = await User.countDocuments({
        _id: {$ne: req.user._id},
        type: req.params.office,
        status: 'ACTIVE'
    })
    let usersQuery = User.find({
        _id: {$ne: req.user._id},
        type: req.params.office,
        status: 'ACTIVE'
    }, "-password");
    if (req.query.page && req.query.limit){
        const skip = (req.query.page - 1) * req.query.limit;
        if (numberOfUsers > 0 && skip >= numberOfUsers){
            throw new NotFoundError("page not found")
        }
        usersQuery = usersQuery.skip(skip).limit(req.query.limit);
    }
    const users = await usersQuery;
    return res.json({
        success: true,
        totalUsers: numberOfUsers,
        results: users.length,
        data: users
    })
}
//Update username, firstName and lastname
exports.updateProfile = async(req, res) => {
    const bodySchema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        username: yup.string().required()
    })
    const parameterSchema = yup.object().shape({
        id: yup.string().required()
    })
    await bodySchema.validate(req.body);
    //use user details from authentication middleware
    let user = req.user
    if (user.status !== 'ACTIVE') {
        throw new UnauthorizedError('Access denied')
    }
    let duplicateUser = await User.findOne({
        _id: {$ne: user._id},
        username: req.body.username,
    })
    //check if there is an existing user with the new username
    if (duplicateUser){
        console.log(duplicateUser);
        throw new ValidationError("username taken")
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    await user.save();
    return res.json({
        success: true,
        data: response.removePassword(user)
    })
}
//change user password
exports.changePassword = async (req, res) => {
    const bodySchema = yup.object().shape({
        oldPassword: yup.string().required(),
        newPassword: yup.string().required(),
    })
    // const parameterSchema = yup.object().shape({
    //     id: yup.string().required()
    // })
    // await parameterSchema.validate(req.params);
    await bodySchema.validate(req.body);
    let user = req.user;
    // if (!user) {
    //     throw new ValidationError("User with specified id not found")
    // }
    if (user.status !== 'ACTIVE') {
        throw new UnauthorizedError('Access denied')
    }
    let status = await argon2.verify(user.password, req.body.oldPassword);
    if (!status){
        throw new ValidationError("Old Password incorrect")
    }
    const newPasswordHash = await argon2.hash(req.body.newPassword);
    user.password = newPasswordHash;
    await user.save();
    return res.json({
        success: true,
        data: response.removePassword(user)
    })
}