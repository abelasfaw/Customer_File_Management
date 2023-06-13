const {expressjwt: jwt} = require('express-jwt');
const UnauthorizedError = require('./../error/unauthorized.error');
const User = require('./../models/user.model');
const officeAccounts = ['KADASTER', 'LAND-OFFICE','REVENUE','CONSTRUCTION'];
exports.validateHeader = (req, res, next)=>{
    if(req.headers.authorization){
        var authorizationToken = req.headers.authorization.split(' ')[1];
        if(authorizationToken!=null){
            next()
        }
        else {
            throw new UnauthorizedError("authorization token not found")
        }
    }
    else {
        throw new UnauthorizedError("authorization headers not found")
    }
}
exports.isUserActive = ()=>{
    return [ jwt({secret:process.env.JWT_SECRET,algorithms: ['HS256']}),
            async(error,req,res,next)=>{
                if(error){
                    throw new UnauthorizedError("Invalid token")
                }
            },
            async(req, res, next) => {
                let user = await User.findOne({
                    _id: req.auth.id
                })
                if (user && user.status === 'ACTIVE') {
                    req.user = user;
                    return next()
                }
                throw new UnauthorizedError("Unauthorized Access")
            }   
    ]
}
exports.isAdmin = async(req,res,next)=>{
    if (req.user.type === 'ADMIN'){
        return next()
    }
    throw new UnauthorizedError("Unauthorized access")
}
exports.isFileRoom = async(req,res,next)=>{
    if (req.user.type === 'FILE-ROOM'){
        return next()
    }
    throw new UnauthorizedError("Unauthorized access")
}    
exports.isAdminOrFileRoom = async(req,res,next)=>{
    if (req.user.type === 'ADMIN' || req.user.type === 'FILE-ROOM'){
        return next()
    }
    throw new UnauthorizedError("Unauthorized access")
}
exports.isOfficeAccount = async(req, res, next)=> {
if (officeAccounts.includes(req.user.type)){
    return next()
}
throw new UnauthorizedError("Unauthorized access")
}