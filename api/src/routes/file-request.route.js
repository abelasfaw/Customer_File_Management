const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwt-auth.middleware');
const FileRequestController = require('../controllers/file-request.controller');

router.route('/')
.post(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, FileRequestController.createFileRequest)
router.route('/office/:state')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, FileRequestController.fetchFileRequestsByOfficeAccount)
router.route('/:state')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, FileRequestController.fetchFileRequests)
router.route('/:fileRequest_id/accept')
.put(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, FileRequestController.acceptFileRequest)
router.route('/:fileRequest_id/deny')
.put(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdminOrFileRoom, FileRequestController.denyFileRequest)

module.exports = router;