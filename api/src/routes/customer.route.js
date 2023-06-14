const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwt-auth.middleware');
const fileUploadMiddleware = require('../middleware/file-upload.middleware');
const customerController = require('../controllers/customer.controller');
router.route('/')
.post(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, customerController.addCustomer)
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(),customerController.searchCustomer)
router.route('/all')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, customerController.fetchAllCustomers)
router.route('/:id')
.put(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, customerController.editCustomer)
router.route('/:id/file/:file_type')
.post(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom,fileUploadMiddleware.customerFileUploadValidator, fileUploadMiddleware.customerFileUploadMiddleware(), customerController.uploadCustomerFile)
router.route('/:id/files/:file_type/:token')
.post(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount,fileUploadMiddleware.customerFileUploadValidatorOfficeAccount, fileUploadMiddleware.customerFileUploadMiddleware(), customerController.uploadCustomerFile)
router.route('/:customer_id/file/:filename/:file_type/:token')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, customerController.fetchCustomerFile)
router.route('/:customer_id/files/:filename/:file_type')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, customerController.fetchCustomerFileForFileRoomAndAdmin)
router.route('/:id')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, customerController.fetchSingleCustomer)
module.exports = router;