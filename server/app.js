/* eslint-disable linebreak-style */
require('express-async-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const { missionsRouter } = require('./routers/missionRouter');
const { soldierRouter } = require('./routers/soldierRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use('/missions', missionsRouter);
app.use('/soldiers', soldierRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(400).send("Couldn't connect");
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));

module.exports = app; // for testing

javascript
Copy code
const { execSync } = require('child_process');

// Execute command to get Python path
let pythonPath;
try {
  // On Unix-like systems (Linux, macOS)
  pythonPath = execSync('which python').toString().trim();
} catch (error) {
  try {
    // On Windows
    pythonPath = execSync('where python').toString().trim();
  } catch (error) {
    console.error('Unable to determine Python path.');
    process.exit(1);
  }
}
