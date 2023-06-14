const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwt-auth.middleware');
const FileAccessController = require('../controllers/file-access.controller');

router.route('/')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, FileAccessController.fetchFileAccessByOfficeAccount)
.patch(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, FileAccessController.deleteFileAccess)
router.route('/:id')
.patch(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, FileAccessController.forwardFileAccess)
module.exports = router;