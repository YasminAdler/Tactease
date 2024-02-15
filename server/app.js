require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const { missionsRouter } = require('./routers/missionRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/missions', missionsRouter);
app.use(errorHandler);
app.use(logger('dev'));

app.listen(port, () => console.log(`Express server is running on port ${port}`));
