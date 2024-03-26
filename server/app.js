require('express-async-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const { StatusCodes } = require('http-status-codes'); // If you use StatusCodes in this file
const { errorHandler } = require('./middlewares/errorHandler');
const { missionsRouter } = require('./routers/missionRouter');
const { soldierRouter } = require('./routers/soldierRouter');
const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
const store = new session.MemoryStore();
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  store,
  cookie: { maxAge: 60000 },
}));

// Routers
app.use('/missions', missionsRouter);
app.use('/soldiers', soldierRouter);

// Global error handler should be after your routes
app.use((error, req, res, next) => {
  console.error('Global error handler:', error.message);
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: error.message || 'An unexpected error occurred.',
    },
  });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(400).send("Couldn't connect");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server is running on port ${port}`));

module.exports = app; // Export for testing
