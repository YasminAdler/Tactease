require('express-async-errors');
const express = require('express')
const logger = require('morgan')
const { missionsRouter } = require('./routers/missionRouter')
const { requestRouter } = require('./routers/request.router')
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/missions', missionsRouter);
app.use('/soldier/request', requestRouter);
app.use(errorHandler);

app.use((req, res) => {
    res.status(400).send("Couldn't connect");
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));

module.exports = app;