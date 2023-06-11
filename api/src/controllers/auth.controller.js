const yup = require('yup');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const NotFoundError = require('../error/not-found.error');
const UnauthorizedError = require('../error/unauthorized.error');
const response = require('../utilities/response');
exports.test = async(req, res, next) =>{
    return res.json({
        status: 'success',
        data:"welcome"
    })
}
exports.login = async(req, res, next)=>{
    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required()
    })
    await schema.validate(req.body);
    let user = await User.findOne({
        username: req.body.username
    })
    if (user){
        if (user.status === 'ACTIVE') {
            let status = await argon2.verify(user.password, req.body.password);
            if (status)
            {
                let token = jwt.sign({
                    id: user._id,
                    type: user.type,
                    status: user.status
                }, process.env.JWT_SECRET);
                user = response.removePassword(user)
                user.token = token;
                return res.json({
                    status: 'success',
                    data: user
                });
            }
            else
            {
                throw new UnauthorizedError("Invalid credentials")
            }
        }
        else {
            throw new UnauthorizedError("Access Denied")
        }
    }
    else{
        throw new NotFoundError("User with specified username not found")
    }
}