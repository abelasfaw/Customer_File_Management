const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwt-auth.middleware');
const userController = require('../controllers/user.controller');
router.route('/')
.post(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), jwtMiddleware.isAdmin, userController.createUser)
.get(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), jwtMiddleware.isAdmin, userController.fetchAllUsers);
router.route('/profile')
.patch(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), userController.updateProfile);
router.route('/password')
.patch(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), userController.changePassword);
router.route('/:office')
.get(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), jwtMiddleware.isOfficeAccount, userController.fetchUsersInSingleOffice);
router.route('/:id/block')
.patch(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), jwtMiddleware.isAdmin, userController.blockUser);
router.route('/:id/activate')
.patch(jwtMiddleware.validateHeader, jwtMiddleware.isUserActive(), jwtMiddleware.isAdmin, userController.activateUser);

module.exports = router;
