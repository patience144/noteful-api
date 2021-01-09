const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV, API_KEY } = require('./config');
const FoldersRouter = require('./folders-router');
const NotesRouter = require('./notes-router');

const app = express();
const morganOption =
  (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'info.log'})
  ]
});
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
};

app.use(helmet());
app.use(cors());
app.use(morgan(morganOption));
app.use(express.json());

// app.use(validation);
app.use(FoldersRouter);
app.use(NotesRouter);
app.use(errorHandler);

function validation(req, res, next) {
  const auth = req.get('Authorization')
  if (!auth || auth.split(' ')[1] !== API_KEY) {
    res.status(401).json({error: 'Unauthorized access.'});
  };
  next();
};

function errorHandler(error, req, res, next) {
  const response = 
    (NODE_ENV === 'production')
      ? {error: 'Server error.'}
      : console.log(error)
        && {message: error.message, error};
  res.status(500).json(response);
};

module.exports = app;