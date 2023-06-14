const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const NotFoundError = require('./error/not-found.error');
const errorMiddleware = require('./middleware/error.middleware');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const customerRoute = require('./routes/customer.route');
const fileRequestRoutes = require('./routes/file-request.route');
const fileAccessRoutes = require('./routes/file-access.route');
const app = express();
const router = express.Router();
app.use(cors({
    origin: '*'
}))
const path = require('path');
app.use(express.static(path.join(__dirname, "client")));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('files'));
app.use('/api/v1', router);
router.use('/', authRoute);
router.use('/user', userRoute);
router.use('/customer', customerRoute);
router.use('/file-request', fileRequestRoutes);
router.use('/file-access', fileAccessRoutes);
app.use('*', (req, res, next)=>{
    throw new NotFoundError(`Can't find ${req.originalUrl} on this server`);
})
app.use(errorMiddleware);
module.exports = app;