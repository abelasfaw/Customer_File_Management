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