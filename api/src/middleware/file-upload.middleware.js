const multer = require('multer');
const yup = require('yup');
const os = require('os');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const FileAccess = require('../models/file-access.model');
const ValidationError = require('../error/validation.error');
const UnauthorizedError = require('../error/unauthorized.error');
const NotFoundError = require('../error/not-found.error');
const idChecker = require('../utilities/id');
const {v4} = require('uuid');
const fileTypes = ['RECEIPT', 'AGREEMENT', 'APPLICATION', 'LICENSE', 'OTHERS' ];
//os.type() returns Linux, Darwin (macOS) and Windows_NT. checking os types to use different file path
const multerStorge = multer.diskStorage({
    destination: (req, file, callback) => {
      if (os.type() === 'Linux') {
        //files/customer-${req.params.id}/${req.body.type}
        callback(null, `files/customer-${req.params.id}/${req.params.file_type}`); 
      } else if (os.type() === 'Windows_NT') {
        //files\\customer-${req.params.id}\\${req.body.type}
        callback(null, `files\\customer-${req.params.id}\\${req.params.file_type}`);
      }
    },
    filename: (req, file, callback) => {
      const extension = file.mimetype.split('/')[1];
      callback(null, `file-${v4().toString()}.${extension}`);
    },
  });

const multerFilter = (req, file, callback) => {
if (file.mimetype === 'application/pdf') {
    callback(null, true);
} else {
    callback(new ValidationError('Unsupported file format.'));
}
};
let upload = multer({
    storage: multerStorge,
    fileFilter: multerFilter,
});
const customerFileUploadMiddleware = () => {
    return [
      upload.fields([
        {name: 'file', maxCount: 1},
      ]),
      async (req, res, next) => {
        if (!req.files) {
          req.files = {};
        }
        await
          yup.object().shape({
            file: yup.mixed().required(),
          }).validate(req.files,{abortEarly: false})
          
        next();
      },
    ];
  };
const customerFileUploadValidator = async (req, res, next)=> {
    let schema = yup.object().shape({
      id: yup.string().required('Customer id required'),
      file_type: yup.mixed().oneOf(fileTypes).required(),         
    })
    await schema.validate(req.params, {abortEarly:false});  
    if (!(idChecker.isValidObjectId(req.params.id))) {
        throw new ValidationError('Invalid customer id')
    }
    let customer = await Customer.findOne({
        _id: req.params.id    
    })
    if (!customer) {
      throw new NotFoundError("Customer with specified id not found")
    }
    req.customer = customer
    next()
}
const customerFileUploadValidatorOfficeAccount = async (req, res, next)=> {
    let schema = yup.object().shape({
      id: yup.string().required('Customer id required'),
      file_type: yup.mixed().oneOf(fileTypes).required(),
      token: yup.string().required()         
    })
    await schema.validate(req.params, {abortEarly:false});  
    if (!(idChecker.isValidObjectId(req.params.id))) {
        throw new ValidationError('Invalid customer id')
    }
    let customer = await Customer.findOne({
        _id: req.params.id    
    })
    if (!customer) {
      throw new NotFoundError("Customer with specified id not found")
    }
    req.customer = customer
    console.log("token", req.params.token)
    let fileAccess = await FileAccess.findOne({
      token: req.params.token
    })
    console.log(fileAccess)
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
          await FileAccess.deleteOne({
              token: fileAccess.token
          })
      }
      throw new UnauthorizedError("File Access expired")
    }
    console.log(req.user._id, tokenData.grantedTo)
    console.log(customer._id, tokenData.customer)
    if (req.user._id != tokenData.grantedTo || customer._id != tokenData.customer){
      throw new UnauthorizedError("Unauthorized access")
    }
    next()
}
module.exports = {customerFileUploadMiddleware, customerFileUploadValidator, customerFileUploadValidatorOfficeAccount};