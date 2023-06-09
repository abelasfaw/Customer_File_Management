const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const NotFoundError = require('./error/not-found.error');
const errorMiddleware = require('./middleware/error.middleware');
const app = express();
const router = express.Router();
app.use(cors({
    origin: '*'
}))
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1', router);
app.use('*', (req, res, next)=>{
    throw new NotFoundError(`Can't find ${req.originalUrl} on this server`);
})
app.use(errorMiddleware);
module.exports = app;