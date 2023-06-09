const NotFoundError = require('./../error/not-found.error');
const BadRequestError = require('./../error/bad-request.error');
const ValidationError = require('./../error/validation.error');
const UnauthorizedError = require('./../error/unauthorized.error');
const yup = require('yup')
module.exports = async (error, req, res , next)=>{
    if(error instanceof NotFoundError){
        return res.status(404).json({success:false, err:{message: error.message}})
    }
    else if(error instanceof BadRequestError ){
        return res.status(400).json({success:false, err:{message:error.message}})
    }
    else if(error instanceof UnauthorizedError ){
        return res.status(401).json({success:false, err:{message:error.message}})
    }
    else if(error instanceof ValidationError){
        return res.status(422).json({success:false, err:{message:error.message}})
    }
    else if(error instanceof yup.ValidationError){
        return res.status(422).json({success:false, err:{message:error.errors[0]}})
    }
    
    console.log(typeof error , error)
    return res.status(500).json({success:false, err:{message:"server error"}})
}