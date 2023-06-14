const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwt-auth.middleware');
const authController = require('../controllers/auth.controller');
router.route('/login')
.post(authController.login);
router.route('/test')
.get(jwtMiddleware.validateHeader,jwtMiddleware.isUserActive(), jwtMiddleware.isAdmin, authController.test);
module.exports = router;